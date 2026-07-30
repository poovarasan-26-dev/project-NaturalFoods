import { motion } from 'framer-motion';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="nf-loader-wrapper">
      <motion.div
        className="nf-loader"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" stroke="#e0e0e0" strokeWidth="4" fill="none" />
          <circle
            cx="24" cy="24" r="20"
            stroke="#0B5D3B"
            strokeWidth="4"
            fill="none"
            strokeDasharray="80 40"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
      <p className="nf-loader-text">{text}</p>
    </div>
  );
}
