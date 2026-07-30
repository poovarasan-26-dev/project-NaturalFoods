import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function LoginRequiredModal({ message, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="nf-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="nf-modal nf-login-required-modal"
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 16 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="nf-modal-close" onClick={onClose}>
            <FiX />
          </button>

          <div className="nf-login-required-body">
            <div className="nf-login-required-icon">
              <FiLogIn />
            </div>
            <div>
              <h3>Please login to add products to your cart.</h3>
              <p className="nf-login-required-message">
                Sign in to continue shopping and keep your cart ready.
              </p>
            </div>
            <div className="nf-login-required-actions">
              <Link to="/login" className="nf-btn nf-btn-primary" onClick={onClose}>
                Login
              </Link>
              <button className="nf-btn nf-btn-outline" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
