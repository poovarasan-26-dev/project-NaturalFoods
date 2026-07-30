import { useState, useEffect, useCallback } from 'react';

export default function useThemeProvider() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nf_theme') || 'light';
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('nf_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}
