
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
}

const loadCartFromSession = (): CartState => {
  if (typeof window === 'undefined') return { items: [], total: 0 };
  const saved = sessionStorage.getItem('cart');
  return saved ? JSON.parse(saved) : { items: [], total: 0 };
};

const initialState: CartState = loadCartFromSession();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      sessionStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      sessionStorage.setItem('cart', JSON.stringify(state));
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
  const item = state.items.find(item => item.id === action.payload.id);
  if (item) {
    item.quantity = Math.max(0, action.payload.quantity);
    if (item.quantity === 0) {
      state.items = state.items.filter(i => i.id !== action.payload.id);
    }
  }
  state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  sessionStorage.setItem('cart', JSON.stringify(state));
},

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      sessionStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;