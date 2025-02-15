
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirestoreProduct, Product } from '../types';

const FAKE_STORE_API = 'https://fakestoreapi.com/products';

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      // Get Firebase products
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const firebaseProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));

      // Get Fake Store products
      const response = await fetch(FAKE_STORE_API);
      const fakeStoreProducts = await response.json();
      const mappedFakeStoreProducts = fakeStoreProducts.map((product: any) => ({
        id: `fake_${product.id}`,
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        rating: product.rating
      }));

      // Combine both sources
      return [...firebaseProducts, ...mappedFakeStoreProducts];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  async createProduct(product: Omit<FirestoreProduct, 'createdAt' | 'updatedAt'>): Promise<string> {
    const productsRef = collection(db, 'products');
    const now = new Date().toISOString();
    const docRef = await addDoc(productsRef, {
      ...product,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async updateProduct(id: string, updates: Partial<FirestoreProduct>): Promise<void> {
    // Only allow updating Firebase products
    if (!id.startsWith('fake_')) {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    }
  },

  async deleteProduct(id: string): Promise<void> {
    // Only allow deleting Firebase products
    if (!id.startsWith('fake_')) {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
    }
  }
};
