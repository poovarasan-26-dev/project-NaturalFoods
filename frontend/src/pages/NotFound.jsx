import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="nf-page">
      <section className="nf-section">
        <div className="nf-container">
          <motion.div
            className="nf-not-found"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="nf-not-found-icon">🔍</span>
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="nf-btn nf-btn-primary">Go Home</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
