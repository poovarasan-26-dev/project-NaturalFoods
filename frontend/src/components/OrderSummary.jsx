import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

export default function OrderSummary({ items, subtotal, delivery = 0, total }) {
  return (
    <motion.div
      className="nf-order-summary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>Order Summary</h3>
      <div className="nf-summary-items">
        {items.map((item, i) => (
          <div key={i} className="nf-summary-item">
            <span>{item.name} x {item.quantity}</span>
            <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="nf-summary-divider" />
      <div className="nf-summary-row">
        <span>Subtotal</span>
        <span>Rs. {subtotal.toFixed(2)}</span>
      </div>
      <div className="nf-summary-row">
        <span>Delivery</span>
        <span>{delivery === 0 ? 'Free' : `Rs. ${delivery.toFixed(2)}`}</span>
      </div>
      <div className="nf-summary-divider" />
      <div className="nf-summary-row nf-summary-total">
        <strong>Total</strong>
        <strong>Rs. {total.toFixed(2)}</strong>
      </div>
    </motion.div>
  );
}
