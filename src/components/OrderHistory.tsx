
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.uid],
    queryFn: () => user?.uid ? orderService.getUserOrders(user.uid) : Promise.resolve([]),
    enabled: !!user?.uid
  });

  if (isLoading) return <div>Loading orders...</div>;
  if (!user) return <div>Please log in to view your orders.</div>;

  return (
    <div className="container mt-4">
      <h2>Order History</h2>
      {selectedOrder ? (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Order Details #{selectedOrder.id}</h5>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedOrder(null)}
            >
              Back to Orders
            </button>
          </div>
          <div className="card-body">
            <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            <p>Status: {selectedOrder.status}</p>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map(item => (
                    <tr key={item.productId}>
                      <td>{item.title}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                    <td><strong>${selectedOrder.totalAmount.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {orders?.map(order => (
            <div key={order.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order #{order.id}</h5>
                  <p className="card-text">
                    Date: {new Date(order.createdAt).toLocaleDateString()}<br />
                    Items: {order.items.length}<br />
                    Total: ${order.totalAmount.toFixed(2)}<br />
                    Status: {order.status}
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
