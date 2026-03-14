"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Role } from '@/lib/firebase/auth';

interface AuthUser {
    uid: string;
    email: string;
    role: Role;
    firstName?: string;
    lastName?: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            loading: true, // Initially loading until auth state is determined
            setUser: (user) => set({ user, loading: false }),
            clearUser: () => set({ user: null, loading: false }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

// Only run Firebase auth listener on the client side
if (typeof window !== 'undefined') {
  Promise.all([
    import('firebase/auth'),
    import('@/lib/firebase'),
    import('firebase/firestore'),
  ]).then(([{ onAuthStateChanged }, { auth, db }, { doc, getDoc }]) => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          useAuthStore.getState().setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            role: userData.role || 'customer',
            firstName: userData.firstName,
            lastName: userData.lastName,
          });
        } else {
          useAuthStore.getState().setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            role: 'customer',
          });
        }
      } else {
        useAuthStore.getState().clearUser();
      }
    });
  });
}
