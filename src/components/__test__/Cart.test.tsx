
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../store/cartSlice';
import authReducer from '../../store/authSlice';
import Cart from '../Cart';

const mockStore = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer
  },
  preloadedState: {
    cart: {
      items: [],
      total: 0
    },
    auth: {
      user: null,
      loading: false,
      error: null
    }
  }
});

describe('Cart Component', () => {
  const setup = () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders empty cart message when cart is empty', () => {
    setup();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('shows login message when user is not logged in', () => {
    setup();
    const checkoutButton = screen.getByRole('button', { name: /login to checkout/i });
    expect(checkoutButton).toBeDisabled();
  });
});
