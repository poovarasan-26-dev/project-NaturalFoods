import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext';
import { getOrders } from '../services/cart';
import Loader from '../components/Loader';

export default function Orders() {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await getOrders(user.email);
        setOrders(res.data.results || res.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div className="nf-page">
      <section className="nf-page-header">
        <div className="nf-container">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            My Orders
          </motion.h1>
        </div>
      </section>

      <section className="nf-section">
        <div className="nf-container">
          {orders.length === 0 ? (
            <div className="nf-empty-state">
              <span className="nf-empty-icon">📦</span>
              <h2>No Orders Yet</h2>
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="nf-orders-list">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  className="nf-order-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="nf-order-card-header">
                    <div>
                      <h3>Order {order.order_id}</h3>
                      <span className="nf-order-date">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <span className={`nf-order-status nf-status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="nf-order-items">
                    {order.items?.map((item) => (
                      <div key={item.id} className="nf-order-item">
                        <span>{item.product_name} x {item.quantity}</span>
                        <span>Rs. {parseFloat(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="nf-order-card-footer">
                    <span>Shipping: {order.shipping_address}</span>
                    <strong>Total: Rs. {parseFloat(order.total_amount).toFixed(2)}</strong>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
