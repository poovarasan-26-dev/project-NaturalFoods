import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiArrowLeft, FiMinus, FiPlus, FiZap } from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';
import { getProduct } from '../services/cart';
import Loader from '../components/Loader';
import LoginRequiredModal from '../components/LoginRequiredModal';
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { addToCart, loading: cartLoading } = useCartContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
      } catch {
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      setShowLoginRequired(true);
      return;
    }
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      setShowLoginRequired(true);
      return;
    }
    await addToCart(product.id, quantity);
    navigate('/cart');
  };

  if (loading) return <Loader />;
  if (!product) return null;

  const imageUrl = product.image_url || '/placeholder-product.png';

  return (
    <div className="nf-page">
      <section className="nf-section">
        <div className="nf-container">
          <motion.button
            className="nf-back-btn"
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <FiArrowLeft /> Back
          </motion.button>

          <div className="nf-detail-grid">
            <motion.div
              className="nf-detail-image"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img src={imageUrl} alt={product.name} />
            </motion.div>

            <motion.div
              className="nf-detail-info"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="nf-product-category">{product.category_name}</span>
              <h1>{product.name}</h1>
              <p className="nf-detail-desc">{product.description || 'No description available.'}</p>

              <div className="nf-detail-meta">
                <span className="nf-product-price-lg">Rs. {parseFloat(product.price).toFixed(2)}</span>
                {product.unit && <span className="nf-detail-unit">per {product.unit}</span>}
                <span className={`nf-stock-badge nf-stock-${product.availability}`}>
                  {product.stock_status || product.availability?.replace('_', ' ')}
                </span>
              </div>

              <div className="nf-detail-stock">
                <span>In Stock: {product.stock} units</span>
              </div>

              <div className="nf-qty-selector">
                <span>Quantity</span>
                <div className="nf-qty-controls-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="nf-detail-actions">
                <motion.button
                  className="nf-btn nf-btn-primary nf-btn-lg"
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.availability === 'out_of_stock'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiShoppingCart />
                  {added ? 'Added!' : 'Add to Cart'}
                </motion.button>
                <motion.button
                  className="nf-btn nf-btn-secondary nf-btn-lg"
                  onClick={handleBuyNow}
                  disabled={cartLoading || product.availability === 'out_of_stock'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiZap /> Buy Now
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {showLoginRequired && (
        <LoginRequiredModal onClose={() => setShowLoginRequired(false)} />
      )}
    </div>
  );
}
