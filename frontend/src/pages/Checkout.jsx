import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import { createOrder } from '../services/cart';
import OrderSummary from '../components/OrderSummary';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { cartItems, cartTotal, clearAll } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    full_name: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    payment_method: 'cod',
  });
  const [error, setError] = useState('');

  const delivery = cartTotal >= 500 ? 0 : 49;
  const total = cartTotal + delivery;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.address || !form.city || !form.state || !form.pincode) {
      setError('Please fill in all required fields.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...form,
        items: cartItems.map((item) => ({
          product_id: item.product,
          quantity: item.quantity,
        })),
      };
      const res = await createOrder(orderData);
      setOrderId(res.data.order_id);
      setSuccess(true);
      clearAll();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  if (success) {
    return (
      <div className="nf-page">
        <div className="nf-container">
          <motion.div
            className="nf-success-box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="nf-success-icon">
              <FiCheck size={48} />
            </div>
            <h2>Thank You!</h2>
            <p>Your order has been placed successfully.</p>
            <p className="nf-order-id">Order ID: <strong>{orderId}</strong></p>
            <div className="nf-success-btns">
              <button className="nf-btn nf-btn-primary" onClick={() => navigate('/orders')}>
                View My Orders
              </button>
              <button className="nf-btn nf-btn-outline" onClick={() => navigate('/products')}>
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="nf-page">
      <section className="nf-page-header">
        <div className="nf-container">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            Checkout
          </motion.h1>
        </div>
      </section>

      <section className="nf-section">
        <div className="nf-container">
          <form className="nf-checkout-grid" onSubmit={handleSubmit}>
            <div className="nf-checkout-form">
              <h3>Shipping Details</h3>
              {error && <div className="nf-alert nf-alert-error">{error}</div>}
              <div className="nf-form-row">
                <div className="nf-form-group">
                  <label>Full Name *</label>
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required />
                </div>
                <div className="nf-form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="nf-form-group">
                <label>Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="nf-form-group">
                <label>Address *</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={3} required />
              </div>
              <div className="nf-form-row">
                <div className="nf-form-group">
                  <label>City *</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div className="nf-form-group">
                  <label>State *</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} required />
                </div>
                <div className="nf-form-group">
                  <label>Pincode *</label>
                  <input type="text" name="pincode" value={form.pincode} onChange={handleChange} required />
                </div>
              </div>

              <h3>Payment Method</h3>
              <div className="nf-payment-options">
                <label className={`nf-payment-option ${form.payment_method === 'cod' ? 'active' : ''}`}>
                  <input type="radio" name="payment_method" value="cod" checked={form.payment_method === 'cod'} onChange={handleChange} />
                  <span>Cash on Delivery</span>
                </label>
                <label className={`nf-payment-option ${form.payment_method === 'upi' ? 'active' : ''}`}>
                  <input type="radio" name="payment_method" value="upi" checked={form.payment_method === 'upi'} onChange={handleChange} />
                  <span>UPI</span>
                </label>
                <label className={`nf-payment-option ${form.payment_method === 'card' ? 'active' : ''}`}>
                  <input type="radio" name="payment_method" value="card" checked={form.payment_method === 'card'} onChange={handleChange} />
                  <span>Card</span>
                </label>
              </div>

              <motion.button
                type="submit"
                className="nf-btn nf-btn-primary nf-btn-lg nf-btn-block"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </motion.button>
            </div>

            <div className="nf-checkout-summary">
              <OrderSummary
                items={cartItems.map((item) => ({
                  name: item.product_name,
                  price: parseFloat(item.product_price),
                  quantity: item.quantity,
                }))}
                subtotal={cartTotal}
                delivery={delivery}
                total={total}
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
