import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';
import LoginRequiredModal from './LoginRequiredModal';

export default function ProductCard({ product, index = 0 }) {
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const { user } = useAuthContext();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowLoginRequired(true);
      return;
    }
    await addToCart(product.id);
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const imageUrl = product.image_url || '/placeholder-product.png';

  return (
    <motion.div
      className="nf-product-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Link to={`/products/${product.id}`} className="nf-product-card-link">
        <div className="nf-product-image-wrap">
          <img src={imageUrl} alt={product.name} className="nf-product-image" loading="lazy" />
          <div className="nf-product-overlay">
            <motion.button
              className="nf-product-overlay-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
            >
              <FiShoppingCart />
            </motion.button>
            <motion.button
              className="nf-product-overlay-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleViewDetails}
            >
              <FiEye />
            </motion.button>
          </div>
          {product.availability === 'limited' && (
            <span className="nf-product-tag nf-tag-limited">Limited</span>
          )}
          {product.availability === 'out_of_stock' && (
            <span className="nf-product-tag nf-tag-out">Out of Stock</span>
          )}
        </div>
        <div className="nf-product-info">
          <span className="nf-product-category">{product.category_name}</span>
          <h3 className="nf-product-name">{product.name}</h3>
          <div className="nf-product-bottom">
            <span className="nf-product-price">Rs. {parseFloat(product.price).toFixed(2)}</span>
            <span className={`nf-stock-badge nf-stock-${product.availability}`}>
              {product.stock_status || product.availability?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </Link>
      {showLoginRequired && (
        <LoginRequiredModal onClose={() => setShowLoginRequired(false)} />
      )}
    </motion.div>
  );
}
