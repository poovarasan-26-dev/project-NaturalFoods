import api from './api';

export const getCart = () => api.get('/cart/');

export const addToCart = (productId, quantity = 1) =>
  api.post('/cart/add/', { product_id: productId, quantity });

export const updateCartItem = (itemId, quantity) =>
  api.put(`/cart/item/${itemId}/`, { quantity });

export const removeCartItem = (itemId) =>
  api.delete(`/cart/item/${itemId}/`);

export const clearCart = () => api.delete('/cart/clear/');

export const getProducts = (params = {}) => api.get('/products/', { params });

export const getProduct = (id) => api.get(`/products/${id}/`);

export const getCategories = () => api.get('/categories/');

export const submitContact = (data) => api.post('/contact/', data);

export const createOrder = (data) => api.post('/orders/create/', data);

export const getOrders = (email) => api.get('/orders/', { params: { email } });

export const getNotificationCount = () => api.get('/notifications/count/');
