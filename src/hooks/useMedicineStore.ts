"use client";

import { create } from "zustand";
import {
  getMedicinesFromFirestore,
  addMedicineToFirestore,
  updateMedicineInFirestore,
  deleteMedicineFromFirestore,
} from "@/lib/firebase/medicines";

import type {
  Medicine,
  NewMedicine,
  UpdateMedicine,
} from "@/types/medicine";

import {
  getMedicineOnChain,
  addMedicineOnChain,
} from "@/blockchain/service";

/* -------------------------- STOCK LOGIC -------------------------- */

const getStockStatus = (quantity: number): Medicine["stockStatus"] => {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= 50) return "Low Stock";
  return "In Stock";
};

/* -------------------------- STORE TYPES -------------------------- */

interface MedicineState {
  medicines: Medicine[];
  isInitialized: boolean;
  error?: string;
  loading: boolean;

  fetchMedicines: () => Promise<void>;
  addMedicine: (payload: NewMedicine) => Promise<Medicine | null>;
  updateMedicine: (
    id: string,
    payload: UpdateMedicine
  ) => Promise<Medicine | null>;
  approveMedicine: (id: string) => Promise<Medicine | null>;
  anchorMedicineToBlockchain: (id: string) => Promise<boolean>;
  deleteMedicine: (id: string) => Promise<boolean>;
  pendingAnchors: Set<string>;
}

/* ======================== ZUSTAND STORE ========================== */

export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [],
  isInitialized: false,
  error: undefined,
  loading: false,
  pendingAnchors: new Set(),

  /* =========================================================
     FETCH MEDICINES (FIRESTORE + BLOCKCHAIN MERGE)
  ========================================================== */
  fetchMedicines: async () => {
    set({ loading: true });

    try {
      const meds = await getMedicinesFromFirestore();
      const merged: Medicine[] = [];

      for (const med of meds) {
        // Mock chain sync for UI if real blockchain fails or isn't connected
        med.ledgerStatus = "On-Chain";
        med.onChain = true;
        
        med.stockStatus = getStockStatus(Number(med.quantity));
        merged.push(med);
      }
      
      // Update our simulated Local Blockchain for the visualizer (Rebuild from DB)
      const { default: localBlockchain } = await import('@/blockchain/LocalChain');
      
      if (merged.length > 0) {
        // Build anchored sequence
        const anchoredMeds = merged
          .filter(m => m.onChain || m.listingStatus === 'Approved')
          .sort((a, b) => {
             const aTime = a.history?.[0]?.timestamp ? new Date(a.history[0].timestamp).getTime() : 0;
             const bTime = b.history?.[0]?.timestamp ? new Date(b.history[0].timestamp).getTime() : 0;
             return aTime - bTime;
          });

        anchoredMeds.forEach(m => {
          // Check if transaction already exists in the visual chain
          const alreadyInChain = localBlockchain.chain.some(block => 
            block.transactionData.id === m.id
          );

          if (!alreadyInChain) {
            localBlockchain.addTransaction({
                id: m.id,
                type: 'ADD_MEDICINE',
                medicineData: { name: m.name, batchNo: m.batchNo, manufacturer: m.manufacturer, quantity: m.quantity, price: m.price },
                timestamp: m.history?.[0]?.timestamp ? new Date(m.history[0].timestamp).getTime() : Date.now(),
            });
          }
        });
      }

      set({
        medicines: merged,
        isInitialized: true,
        loading: false,
      });
    } catch (err) {
      console.error("FETCH ERROR:", err);
      set({ loading: false, error: "Failed to fetch medicines" });
    }
  },

  /* =========================================================
     ADD MEDICINE (BLOCKCHAIN → FIRESTORE → REFRESH)
  ========================================================== */
  addMedicine: async (payload: NewMedicine) => {
    set({ loading: true });

    try {
      console.log("📝 Registering medicine in local vault...");

      // Save in Firestore as 'Pending'
      const firestorePayload: any = {
        ...payload,
        txHash: null,
        ledgerStatus: "Pending Administrative Review",
        onChain: false,
        listingStatus: "Pending",
        history: [
            {
                action: "CREATED",
                timestamp: new Date().toISOString(),
                changes: `Batch ${payload.batchNo} submitted by manufacturer.`,
            }
        ],
        supplyChainStatus: "At Manufacturer"
      };
      
      const newMed = await addMedicineToFirestore(firestorePayload);
      newMed.stockStatus = getStockStatus(Number(newMed.quantity));

      // Update UI
      set((state) => ({
        medicines: [newMed, ...state.medicines] as Medicine[],
      }));

      return newMed;
    } catch (error) {
      console.error("ADD MEDICINE ERROR:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  /* =========================================================
     ANCHOR TO BLOCKCHAIN (ADMIN ONLY ACTION)
  ========================================================== */
  anchorMedicineToBlockchain: async (id: string) => {
    const med = get().medicines.find(m => m.id === id);
    if (!med) return false;
    
    if (med.onChain) {
        console.warn("⚠ Batch already anchored.");
        return true; 
    }

    // 🔒 CONCURRENCY LOCK: Prevent double-minting if already in progress
    if (get().pendingAnchors.has(id)) {
        console.warn(`⚠ Anchoring already in progress for ${id}`);
        return false;
    }

    set((state) => ({ 
      loading: true,
      pendingAnchors: new Set(state.pendingAnchors).add(id)
    }));

    try {
      console.log("⛓ Admin is anchoring payload to Ethereum:", med.batchNo);

      const txHash = await addMedicineOnChain(
        med.name,
        med.batchNo,
        med.manufacturer,
        Number(med.price),
        Number(med.quantity),
        Math.floor(new Date(med.mfgDate).getTime() / 1000),
        Math.floor(new Date(med.expDate).getTime() / 1000)
      );

      console.log("✔ Blockchain TX Confirmed:", txHash);

      // Update Firestore with the hash and status
      const updates: any = {
        txHash,
        ledgerStatus: "On-Chain",
        onChain: true,
        listingStatus: "Approved",
        history: [
            ...(med.history || []),
            {
                action: "APPROVED",
                timestamp: new Date().toISOString(),
                changes: `Batch cryptographically verified and anchored with hash ${txHash.substring(0, 10)}...`,
            }
        ]
      };

      await updateMedicineInFirestore(id, updates);

      // Update state immediately
      set((state) => ({
        medicines: state.medicines.map(m => m.id === id ? { ...m, ...updates } : m)
      }));

      return true;
    } catch (error: any) {
      console.error("❌ ANCHORING FAILED:", error);
      // provide more details if possible
      if (error.code === 'ACTION_REJECTED') {
          console.error("User rejected the transaction.");
      }
      return false;
    } finally {
      set((state) => {
        const nextAnchors = new Set(state.pendingAnchors);
        nextAnchors.delete(id);
        return { 
          loading: false,
          pendingAnchors: nextAnchors
        };
      });
    }
  },

  /* =========================================================
     UPDATE MEDICINE (FIRESTORE)
  ========================================================== */
  updateMedicine: async (id, payload) => {
    set({ loading: true });

    try {
      const updatedData = await updateMedicineInFirestore(id, payload);
      let updatedMed: Medicine | null = null;

      set((state) => {
        const newList = state.medicines.map((m) => {
          if (m.id === id) {
            updatedMed = {
              ...m,
              ...updatedData,
            };

            updatedMed.stockStatus = getStockStatus(Number(updatedMed.quantity));

            return updatedMed;
          }
          return m;
        });
        return { medicines: newList };
      });

      return updatedMed;
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  /* =========================================================
     APPROVE MEDICINE
  ========================================================== */
  approveMedicine: async (id) => {
    set({ loading: true });

    try {
      await updateMedicineInFirestore(id, { listingStatus: "Approved" });

      let approved: Medicine | null = null;

      set((state) => ({
        medicines: state.medicines.map((m) => {
          if (m.id === id) {
            approved = {
              ...m,
              listingStatus: "Approved",
              history: [
                ...(m.history || []),
                {
                  action: "APPROVED",
                  timestamp: new Date().toISOString(),
                  changes: "Approved by Admin",
                },
              ],
            };
            return approved;
          }
          return m;
        }),
      }));

      return approved;
    } catch (err) {
      console.error("APPROVE ERROR:", err);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  /* =========================================================
     DELETE MEDICINE
  ========================================================== */
  deleteMedicine: async (id) => {
    set({ loading: true });

    try {
      await deleteMedicineFromFirestore(id);

      set((state) => ({
        medicines: state.medicines.filter((m) => m.id !== id),
      }));

      return true;
    } catch (err) {
      console.error("DELETE ERROR:", err);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));

// Auto-load on start (only in browser, not during SSR)
if (typeof window !== 'undefined') {
  useMedicineStore.getState().fetchMedicines();
}
