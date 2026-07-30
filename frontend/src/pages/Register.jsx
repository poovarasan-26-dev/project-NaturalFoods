import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuthContext();
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirm_password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const result = await register(form);
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
              <h1>Create Account</h1>
              <p>Join Natural Foods today</p>
            </div>
            <form className="nf-form" onSubmit={handleSubmit}>
              {error && <div className="nf-alert nf-alert-error">{error}</div>}
              <div className="nf-form-group">
                <label><FiUser /> Username *</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div className="nf-form-group">
                <label><FiMail /> Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                />
              </div>
              <div className="nf-form-group">
                <label><FiPhone /> Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </div>
              <div className="nf-form-group">
                <label><FiLock /> Password *</label>
                <div className="nf-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                  <button type="button" className="nf-input-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="nf-form-group">
                <label><FiLock /> Confirm Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="nf-btn nf-btn-primary nf-btn-block nf-btn-lg"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </motion.button>
            </form>
            <div className="nf-auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="nf-link">Login</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
