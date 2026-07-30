import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiX, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';
import LoginRequiredModal from './LoginRequiredModal';

export default function ProductModal({ product, onClose }) {
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const { user } = useAuthContext();
  const { addToCart, loading } = useCartContext();

  if (!product) return null;

  const imageUrl = product.image_url || '/placeholder-product.png';

  const handleAddToCart = async () => {
    if (!user) {
      setShowLoginRequired(true);
      return;
    }
    await addToCart(product.id);
  };

  return (
    <>
      <motion.div
        className="nf-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="nf-modal nf-product-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
        <button className="nf-modal-close" onClick={onClose}>
          <FiX />
        </button>
        <div className="nf-product-modal-grid">
          <div className="nf-product-modal-image">
            <img src={imageUrl} alt={product.name} />
          </div>
          <div className="nf-product-modal-info">
            <span className="nf-product-category">{product.category_name}</span>
            <h2>{product.name}</h2>
            <p className="nf-product-desc">{product.description || 'No description available.'}</p>
            <div className="nf-product-meta">
              <span className="nf-product-price-lg">Rs. {parseFloat(product.price).toFixed(2)}</span>
              <span className={`nf-stock-badge nf-stock-${product.availability}`}>
                {product.stock_status || product.availability?.replace('_', ' ')}
              </span>
            </div>
            {product.unit && <p className="nf-product-unit">Unit: {product.unit}</p>}
            <div className="nf-product-modal-actions">
              <Link to={`/products/${product.id}`} className="nf-btn nf-btn-outline">
                View Full Details
              </Link>
              <button
                className="nf-btn nf-btn-primary"
                onClick={handleAddToCart}
                disabled={loading || product.availability === 'out_of_stock'}
              >
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>
        </motion.div>
      </motion.div>
      {showLoginRequired && (
        <LoginRequiredModal onClose={() => setShowLoginRequired(false)} />
      )}
    </>
  );
}
