import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCheck } from 'react-icons/fi';
import { submitContact } from '../services/cart';

export default function ContactForm() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.subject || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ full_name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        className="nf-success-box"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="nf-success-icon">
          <FiCheck size={48} />
        </div>
        <h3>Thank You!</h3>
        <p>Your message has been sent. We will get back to you soon.</p>
        <button className="nf-btn nf-btn-primary" onClick={() => setSuccess(false)}>
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <form className="nf-form" onSubmit={handleSubmit}>
      {error && <div className="nf-alert nf-alert-error">{error}</div>}
      <div className="nf-form-row">
        <div className="nf-form-group">
          <label>Full Name *</label>
          <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Your name" required />
        </div>
        <div className="nf-form-group">
          <label>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your email" required />
        </div>
      </div>
      <div className="nf-form-row">
        <div className="nf-form-group">
          <label>Phone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Your phone" />
        </div>
        <div className="nf-form-group">
          <label>Subject *</label>
          <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required />
        </div>
      </div>
      <div className="nf-form-group">
        <label>Message *</label>
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message..." rows={5} required />
      </div>
      <motion.button
        type="submit"
        className="nf-btn nf-btn-primary nf-btn-lg"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? 'Sending...' : <><FiSend /> Send Message</>}
      </motion.button>
    </form>
  );
}
