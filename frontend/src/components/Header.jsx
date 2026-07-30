import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiSun, FiMoon, FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiPackage, FiUserCheck } from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';
import { useThemeContext } from '../context/ThemeContext';

export default function Header() {
  const { user, logout } = useAuthContext();
  const { cartCount } = useCartContext();
  const { theme, toggleTheme } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClick = () => setShowDropdown(false);
    if (showDropdown) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showDropdown]);

  return (
    <>
      <motion.header
        className="nf-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="nf-header-inner">
          <Link to="/" className="nf-logo">
            <img src="/dention.png" alt="Natural Foods" className="nf-logo-img" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover'}} />
            <span className="nf-logo-text">Natural Foods</span>
          </Link>

          <form className="nf-search-form" onSubmit={handleSearch}>
            <FiSearch className="nf-search-icon" />
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nf-search-input"
            />
          </form>

          <div className="nf-header-actions">
            <motion.button
              className="nf-icon-btn"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </motion.button>

            <Link to="/cart" className="nf-icon-btn nf-cart-btn">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  className="nf-cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <Link to="/contact" className="nf-btn nf-btn-outline nf-hide-mobile">
              Contact Us
            </Link>

            {user ? (
              <div className="nf-user-menu">
                <motion.button
                  className="nf-avatar"
                  onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </motion.button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      className="nf-dropdown"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Link to="/profile" className="nf-dropdown-item">
                        <FiUserCheck /> My Profile
                      </Link>
                      <Link to="/orders" className="nf-dropdown-item">
                        <FiPackage /> My Orders
                      </Link>
                      <button className="nf-dropdown-item nf-dropdown-btn" onClick={handleLogout}>
                        <FiLogOut /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="nf-btn nf-btn-primary nf-hide-mobile">
                Login
              </Link>
            )}

            <button
              className="nf-icon-btn nf-hide-desktop"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className="nf-mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <form className="nf-mobile-search" onSubmit={handleSearch}>
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Link to="/products" className="nf-mobile-link" onClick={() => setShowMobileMenu(false)}>Products</Link>
              <Link to="/about" className="nf-mobile-link" onClick={() => setShowMobileMenu(false)}>About</Link>
              <Link to="/contact" className="nf-mobile-link" onClick={() => setShowMobileMenu(false)}>Contact</Link>
              {user ? (
                <>
                  <Link to="/profile" className="nf-mobile-link" onClick={() => setShowMobileMenu(false)}>
                    <FiUser /> My Profile
                  </Link>
                  <Link to="/orders" className="nf-mobile-link" onClick={() => setShowMobileMenu(false)}>
                    <FiPackage /> My Orders
                  </Link>
                  <button className="nf-mobile-link nf-mobile-link-btn" onClick={() => { handleLogout(); setShowMobileMenu(false); }}>
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="nf-mobile-link" onClick={() => setShowMobileMenu(false)}>
                  <FiUser /> Login
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      {showLoginModal && (
        <div className="nf-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <LoginModal onClose={() => setShowLoginModal(false)} />
        </div>
      )}
    </>
  );
}
