//import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { RootState } from '../store';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.auth.user);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // ✅ Fixed: Ensure 'id' remains a string and is properly used
  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity })); // ✅ No 'Number(id)' conversion
  };

  const handleCheckout = async () => {
    if (!user) return;

    try {
      await orderService.createOrder(user.uid, items, total);
      dispatch(clearCart());
      setCheckoutSuccess(true);
      setTimeout(() => setCheckoutSuccess(false), 3000);
      navigate('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="alert alert-success" role="alert">
        Thank you for your purchase! Your cart has been cleared.
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="text-center mt-4">Your cart is empty</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Shopping Cart</h2>
      {items.map((item) => (
        <div key={item.id} className="card mb-3">
          <div className="row g-0">
            <div className="col-md-2">
              <img 
                src={item.image || 'https://placehold.co/200x200/lightgray/white?text=No+Image'} 
                className="img-fluid rounded-start p-2" 
                alt={item.title}
                style={{ height: '150px', objectFit: 'contain' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/200x200';
                }}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">
                  ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </p>
                <div className="d-flex align-items-center gap-2">
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)} // ✅ Used handleQuantityChange
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)} // ✅ Used handleQuantityChange
                  >
                    +
                  </button>
                  <button 
                    className="btn btn-danger btn-sm ms-3"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4>Total: ${total.toFixed(2)}</h4>
        <button 
          className="btn btn-success"
          onClick={handleCheckout}
          disabled={!items.length || !user}
        >
          {user ? `Checkout (${items.length} items)` : 'Login to Checkout'}
        </button>
      </div>
    </div>
  );
}
