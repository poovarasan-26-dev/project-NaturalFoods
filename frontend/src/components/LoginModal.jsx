import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const { login, loading } = useAuthContext();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    const result = await login(form);
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <motion.div
      className="nf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="nf-modal nf-auth-modal"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="nf-modal-close" onClick={onClose}>
          <FiX />
        </button>
        <div className="nf-auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your Natural Foods account</p>
        </div>
        <form className="nf-form" onSubmit={handleSubmit}>
          {error && <div className="nf-alert nf-alert-error">{error}</div>}
          <div className="nf-form-group">
            <label><FiUser /> Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="nf-form-group">
            <label><FiLock /> Password</label>
            <div className="nf-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button type="button" className="nf-input-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <motion.button
            type="submit"
            className="nf-btn nf-btn-primary nf-btn-block"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <div className="nf-auth-switch">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="nf-link">
            Create New Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
