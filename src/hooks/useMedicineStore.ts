"use client";

import { create } from "zustand";
import {
  getMedicinesFromFirestore,
  addMedicineToFirestore,
  updateMedicineInFirestore,
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
}

/* ======================== ZUSTAND STORE ========================== */

export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [],
  isInitialized: false,
  error: undefined,
  loading: false,

  /* =========================================================
     FETCH MEDICINES (FIRESTORE + BLOCKCHAIN MERGE)
  ========================================================== */
  fetchMedicines: async () => {
    set({ loading: true }); // 🔥 removed the "if (isInitialized) return"

    try {
      const meds = await getMedicinesFromFirestore();
      const merged: Medicine[] = [];

      for (const med of meds) {
        const chainData = await getMedicineOnChain(med.batchNo);

        if (chainData && chainData.exists) {
          med.ledgerStatus = "On-Chain";
          med.stock = chainData.stock;
          med.price = chainData.price;
          med.manufacturer = chainData.manufacturer;
        } else {
          med.ledgerStatus = "Pending Confirmation";
        }

        med.stockStatus = getStockStatus(Number(med.stock));
        merged.push(med);
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
    console.log("⛓ Sending medicine to blockchain...");

    const txHash = await addMedicineOnChain(
      payload.name,
      payload.batchNo,
      payload.manufacturer,
      Number(payload.price),
      Number(payload.quantity),
      Math.floor(new Date(payload.mfgDate).getTime() / 1000),
      Math.floor(new Date(payload.expDate).getTime() / 1000)
    );

    console.log("✔ Blockchain TX:", txHash);

    // 🔥 RE-FETCH FROM BLOCKCHAIN
    const chainData = await getMedicineOnChain(payload.batchNo);

    let ledgerStatus = "Pending Confirmation";

    if (chainData && chainData.exists) {
      ledgerStatus = "On-Chain";
    }

    // ✔ Save in Firestore
    const newMed = await addMedicineToFirestore({
      ...payload,
      txHash,
      ledgerStatus,
      onChain: ledgerStatus === "On-Chain",
    });

    // 💾 Update UI
    set((state) => ({
      medicines: [newMed, ...state.medicines],
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
            updatedMed = { ...m, ...updatedData };
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
}));

// Auto-load on start
useMedicineStore.getState().fetchMedicines();
