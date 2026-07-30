import { useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from '../services/cart';
import { useAuthContext } from '../context/AuthContext';

export default function useCartProvider() {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
      return;
    }
    try {
      const res = await getCart();
      setCartItems(res.data.items || []);
      setCartTotal(parseFloat(res.data.total) || 0);
      setCartCount(res.data.item_count || 0);
    } catch {
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    }
  }, [user]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    setLoading(true);
    try {
      await apiAddToCart(productId, quantity);
      await fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Failed to add to cart' };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return removeItem(itemId);
    try {
      await updateCartItem(itemId, quantity);
      await fetchCart();
    } catch {
      // ignore
    }
  }, [fetchCart]);

  const removeItem = useCallback(async (itemId) => {
    try {
      await removeCartItem(itemId);
      await fetchCart();
    } catch {
      // ignore
    }
  }, [fetchCart]);

  const clearAll = useCallback(async () => {
    try {
      await apiClearCart();
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return { cartItems, cartTotal, cartCount, loading, fetchCart, addToCart, updateQuantity, removeItem, clearAll };
}
