
export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface FirestoreProduct extends Omit<Product, 'id'> {
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface CartItem extends Omit<Product, 'id'> {
  id: string;
  quantity: number;
}
