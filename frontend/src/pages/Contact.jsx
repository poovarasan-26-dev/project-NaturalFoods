import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <div className="nf-page">
      <section className="nf-page-header">
        <div className="nf-container">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            We'd love to hear from you. Send us a message.
          </motion.p>
        </div>
      </section>

      <section className="nf-section">
        <div className="nf-container">
          <div className="nf-contact-grid">
            <motion.div
              className="nf-contact-info"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2>Get In Touch</h2>
              <p>Have questions about our products or services? Fill out the form and our team will get back to you within 24 hours.</p>
              <div className="nf-contact-details">
                <div className="nf-contact-detail-item">
                  <span className="nf-contact-detail-icon">📍</span>
                  <div>
                    <strong>Address</strong>
                    <p>123 Green Street, Chennai, Tamil Nadu, India</p>
                  </div>
                </div>
                <div className="nf-contact-detail-item">
                  <span className="nf-contact-detail-icon">📞</span>
                  <div>
                    <strong>Phone</strong>
                    <p>+91 98765 43210</p>
                  </div>
                </div>
                <div className="nf-contact-detail-item">
                  <span className="nf-contact-detail-icon">✉️</span>
                  <div>
                    <strong>Email</strong>
                    <p>info@naturalfoods.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="nf-contact-form-wrap"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
