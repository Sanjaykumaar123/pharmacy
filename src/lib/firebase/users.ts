


import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Role } from './auth';

export interface AppUser {
    uid: string;
    email: string;
    role: Role;
    firstName: string;
    lastName: string;
    createdAt?: string;
}

const usersCollection = collection(db, 'users');

// ========================================================
// GET ALL USERS
// ========================================================
export async function getUsers(): Promise<AppUser[]> {
    try {
        const querySnapshot = await getDocs(usersCollection);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Handle Firestore Timestamp objects which can't be serialized directly
            let createdAt = data.createdAt;
            if (createdAt && typeof createdAt === 'object' && 'toDate' in createdAt) {
                createdAt = createdAt.toDate().toISOString();
            }
            return {
                uid: doc.id,
                email: data.email || '',
                role: data.role || 'customer',
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                createdAt,
            } as AppUser;
        });
    } catch (error) {
        console.error("Error fetching users from Firestore: ", error);
        throw new Error("Could not fetch users.");
    }
}

// ========================================================
// UPDATE USER ROLE
// ========================================================
export async function updateUserRole(uid: string, newRole: Role): Promise<void> {
    try {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
            role: newRole,
        });
    } catch (error) {
        console.error("Error updating user role in Firestore: ", error);
        throw new Error("Could not update user role.");
    }
}
