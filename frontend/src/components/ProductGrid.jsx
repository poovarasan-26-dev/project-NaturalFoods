import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import Loader from './Loader';

export default function ProductGrid({ products, loading, emptyMessage = 'No products found.' }) {
  if (loading) return <Loader />;

  if (!products || products.length === 0) {
    return (
      <div className="nf-empty-state">
        <span className="nf-empty-icon">🍃</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="nf-product-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </motion.div>
  );
}
