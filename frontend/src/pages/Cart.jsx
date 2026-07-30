import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeItem, clearAll } = useCartContext();
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="nf-page">
        <div className="nf-container">
          <div className="nf-empty-state nf-empty-cart">
            <span className="nf-empty-icon">🛒</span>
            <h2>Your Cart is Empty</h2>
            <p>Please login to view your cart.</p>
            <Link to="/login" className="nf-btn nf-btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="nf-page">
        <div className="nf-container">
          <div className="nf-empty-state nf-empty-cart">
            <span className="nf-empty-icon">🛒</span>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any products yet.</p>
            <Link to="/products" className="nf-btn nf-btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nf-page">
      <section className="nf-page-header">
        <div className="nf-container">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            Shopping Cart
          </motion.h1>
        </div>
      </section>

      <section className="nf-section">
        <div className="nf-container">
          <div className="nf-cart-grid">
            <div className="nf-cart-items-list">
              <div className="nf-cart-header-row">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="nf-cart-row"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <div className="nf-cart-product">
                    <img src={item.product_image || '/placeholder-product.png'} alt={item.product_name} />
                    <div>
                      <h4>{item.product_name}</h4>
                    </div>
                  </div>
                  <span>Rs. {parseFloat(item.product_price).toFixed(2)}</span>
                  <div className="nf-qty-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <FiMinus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="nf-cart-item-total">Rs. {parseFloat(item.subtotal).toFixed(2)}</span>
                  <button className="nf-cart-remove" onClick={() => removeItem(item.id)}>
                    <FiTrash2 size={16} />
                  </button>
                </motion.div>
              ))}
              <div className="nf-cart-actions">
                <Link to="/products" className="nf-btn nf-btn-outline">
                  <FiArrowLeft /> Continue Shopping
                </Link>
                <button className="nf-btn nf-btn-danger" onClick={clearAll}>
                  <FiTrash2 /> Clear Cart
                </button>
              </div>
            </div>

            <div className="nf-cart-summary">
              <h3>Order Summary</h3>
              <div className="nf-summary-rows">
                <div className="nf-summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="nf-summary-row">
                  <span>Delivery</span>
                  <span>{cartTotal >= 500 ? 'Free' : 'Rs. 49.00'}</span>
                </div>
                <div className="nf-summary-divider" />
                <div className="nf-summary-row nf-summary-total">
                  <strong>Total</strong>
                  <strong>Rs. {(cartTotal + (cartTotal >= 500 ? 0 : 49)).toFixed(2)}</strong>
                </div>
              </div>
              <Link to="/checkout" className="nf-btn nf-btn-primary nf-btn-block">
                <FiShoppingBag /> Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
