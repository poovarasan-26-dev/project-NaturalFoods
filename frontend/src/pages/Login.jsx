import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
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
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="nf-page">
      <section className="nf-auth-page">
        <div className="nf-container">
          <motion.div
            className="nf-auth-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="nf-auth-header">
              <h1>Welcome Back</h1>
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
                className="nf-btn nf-btn-primary nf-btn-block nf-btn-lg"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>
            </form>
            <div className="nf-auth-switch">
              Don't have an account?{' '}
              <Link to="/register" className="nf-link">Create New Account</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
