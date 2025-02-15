
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../store/cartSlice';
import authReducer from '../../store/authSlice';
import ProductList from '../ProductList';

// Mock the product service
jest.mock('../../services/productService', () => ({
  getAllProducts: jest.fn(() => Promise.resolve([
    {
      id: '1',
      title: 'Test Product',
      price: 99.99,
      description: 'Test Description',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 10 }
    }
  ]))
}));

describe('ProductList Integration', () => {
  const queryClient = new QueryClient();
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer
    }
  });

  const renderProductList = () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ProductList />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('adding product to cart updates the cart state', async () => {
    renderProductList();
    
    // Wait for product to be displayed
    const productTitle = await screen.findByText('Test Product');
    expect(productTitle).toBeInTheDocument();
    
    // Find and click the Add to Cart button
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);
    
    // Verify cart state was updated
    const cartState = store.getState().cart;
    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0]).toMatchObject({
      id: '1',
      title: 'Test Product',
      price: 99.99,
      quantity: 1
    });
  });
});
