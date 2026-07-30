import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useThemeContext } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <motion.button
      className={`nf-theme-toggle ${className}`}
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
    </motion.button>
  );
}
