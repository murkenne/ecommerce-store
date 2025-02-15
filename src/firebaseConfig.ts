import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBHgbgkTo0qyM1uukP2l59qBnL5Gj0tUiE",
  authDomain: "ecommerce-store-74aaa.firebaseapp.com",
  projectId: "ecommerce-store-74aaa",
  storageBucket: "ecommerce-store-74aaa.appspot.com",
  messagingSenderId: "679902149617",
  appId: "1:679902149617:web:bddcda6d7e5ae706e7a250"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;