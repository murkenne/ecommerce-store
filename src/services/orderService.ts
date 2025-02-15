
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Order, CartItem } from '../types';

export const orderService = {
  async createOrder(userId: string, items: CartItem[], totalAmount: number): Promise<string> {
    const ordersRef = collection(db, 'orders');
    const orderData: Omit<Order, 'id'> = {
      userId,
      items: items.map(item => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const docRef = await addDoc(ordersRef, orderData);
    return docRef.id;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() } as Order;
    }
    return null;
  }
};
