import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem('nf_tokens') || 'null');
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = JSON.parse(localStorage.getItem('nf_tokens') || 'null');
      if (tokens?.refresh) {
        try {
          const res = await axios.post(
            `${api.defaults.baseURL}/auth/token/refresh/`,
            { refresh: tokens.refresh }
          );
          const newTokens = { ...tokens, access: res.data.access };
          localStorage.setItem('nf_tokens', JSON.stringify(newTokens));
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('nf_tokens');
          localStorage.removeItem('nf_user');
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
