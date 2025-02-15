
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';

export interface UserProfile {
  email: string;
  name?: string;
  address?: string;
  createdAt: string;
}

export const userService = {
  // Create user profile
  async createUser(userId: string, userData: Partial<UserProfile>) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString()
    });
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
  },

  // Delete user account and data
  async deleteUserAccount(userId: string) {
    const auth = getAuth();
    if (auth.currentUser) {
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', userId));
      // Delete Firebase Auth account
      await deleteUser(auth.currentUser);
    }
  }
};