import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="nf-footer">
      <div className="nf-container">
        <div className="nf-footer-grid">
          <div className="nf-footer-brand">
            <Link to="/" className="nf-logo">
              <div className="nf-logo-icon">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" fill="#0B5D3B" />
                  <path d="M16 6C12 6 8 10 8 15C8 20 12 26 16 26C14 22 13 18 14 14C15 10 18 8 16 6Z" fill="#27AE60" />
                  <path d="M16 6C20 6 24 10 24 15C24 20 20 26 16 26C18 22 19 18 18 14C17 10 14 8 16 6Z" fill="#fff" opacity="0.3" />
                </svg>
              </div>
              <span className="nf-logo-text">Natural Foods</span>
            </Link>
            <p className="nf-footer-desc">
              Fresh fruits, vegetables and nutrition products directly from farms to your doorstep. Eat healthy, live healthy.
            </p>
            <div className="nf-social-links">
              <a href="#" className="nf-social-link"><FiFacebook /></a>
              <a href="#" className="nf-social-link"><FiInstagram /></a>
              <a href="#" className="nf-social-link"><FiLinkedin /></a>
            </div>
          </div>

          <div className="nf-footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="nf-footer-links">
            <h4>Categories</h4>
            <Link to="/products">Organic Vegetables</Link>
            <Link to="/products">Fresh Fruits</Link>
            <Link to="/products">Whole Grains</Link>
            <Link to="/products">Dairy & Eggs</Link>
          </div>

          <div className="nf-footer-contact">
            <h4>Contact Us</h4>
            <div className="nf-contact-item">
              <FiMapPin />
              <span>123 Green Street, Chennai, Tamil Nadu, India</span>
            </div>
            <div className="nf-contact-item">
              <FiPhone />
              <span>+91 98765 43210</span>
            </div>
            <div className="nf-contact-item">
              <FiMail />
              <span>info@naturalfoods.com</span>
            </div>
          </div>
        </div>

        <div className="nf-footer-bottom">
          <p>&copy; {new Date().getFullYear()} Natural Foods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
