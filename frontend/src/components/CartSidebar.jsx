import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCartContext } from '../context/CartContext';

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, cartTotal, updateQuantity, removeItem } = useCartContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="nf-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="nf-cart-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="nf-sidebar-header">
              <h3><FiShoppingBag /> Your Cart</h3>
              <button className="nf-icon-btn" onClick={onClose}>
                <FiX size={20} />
              </button>
            </div>

            <div className="nf-sidebar-body">
              {cartItems.length === 0 ? (
                <div className="nf-empty-state">
                  <span className="nf-empty-icon">🛒</span>
                  <p>Your cart is empty</p>
                  <Link to="/products" className="nf-btn nf-btn-primary" onClick={onClose}>
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="nf-cart-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="nf-cart-item">
                      <img src={item.product_image || '/placeholder-product.png'} alt={item.product_name} />
                      <div className="nf-cart-item-info">
                        <h4>{item.product_name}</h4>
                        <p>Rs. {parseFloat(item.product_price).toFixed(2)}</p>
                        <div className="nf-qty-controls">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <FiMinus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>
                      <button className="nf-cart-remove" onClick={() => removeItem(item.id)}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="nf-sidebar-footer">
                <div className="nf-cart-total">
                  <span>Total</span>
                  <strong>Rs. {cartTotal.toFixed(2)}</strong>
                </div>
                <Link to="/cart" className="nf-btn nf-btn-primary nf-btn-block" onClick={onClose}>
                  View Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
