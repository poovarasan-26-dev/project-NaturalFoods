import { createContext, useContext } from 'react';
import useCartProvider from '../hooks/useCart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const cart = useCartProvider();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within CartProvider');
  return context;
}
