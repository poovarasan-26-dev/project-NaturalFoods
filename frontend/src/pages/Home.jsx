import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import { getProducts, getCategories } from '../services/cart';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts({ limit: 6 }),
          getCategories(),
        ]);
        setProducts(prodRes.data.results || prodRes.data || []);
        setCategories(catRes.data.results || catRes.data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="nf-page">
      <Hero />

      <section className="nf-section">
        <div className="nf-container">
          <motion.div
            className="nf-section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Organic Foods</h2>
            <p>Fresh products available now</p>
          </motion.div>
          <ProductGrid products={products} loading={loading} emptyMessage="No products available yet." />
          {!loading && products.length > 0 && (
            <div className="nf-section-footer">
              <Link to="/products" className="nf-btn nf-btn-primary">
                View All Products <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="nf-section nf-section-alt">
          <div className="nf-container">
            <motion.div
              className="nf-section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>Browse Categories</h2>
              <p>Find exactly what you need</p>
            </motion.div>
            <div className="nf-category-grid">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  className="nf-category-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/products?category=${cat.slug}`}>
                    <div className="nf-category-icon">🍃</div>
                    <h3>{cat.name}</h3>
                    <p>{cat.product_count || 0} products</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="nf-section nf-about-preview">
        <div className="nf-container">
          <div className="nf-about-preview-grid">
            <motion.div
              className="nf-about-preview-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="nf-section-badge">About Us</span>
              <h2>About Natural Foods</h2>
              <p>
                We are committed to bringing you the freshest organic produce directly from local farms.
                Our mission is to make healthy eating accessible, affordable, and convenient for everyone.
              </p>
              <p>
                From farm-fresh vegetables to nutritious grains, every product in our catalog is carefully
                selected to ensure the highest quality and nutritional value.
              </p>
              <Link to="/about" className="nf-btn nf-btn-primary">
                Learn More <FiArrowRight />
              </Link>
            </motion.div>
            <motion.div
              className="nf-about-preview-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="nf-about-image-placeholder">
                <span>🥗</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
