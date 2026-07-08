const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';

function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  if (typeof window !== 'undefined') {
    const host = window.location.hostname || '';
    if (host.includes('netlify.app') || host.includes('render.com')) {
      return 'https://project-naturalfoods.onrender.com';
    }
  }

  return DEFAULT_API_BASE_URL;
}

const API_BASE = getApiBaseUrl();

export function resolveImage(src, cacheBust = true) {
  if (!src) return null;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const path = src.startsWith('/') ? src : `/${src}`;
  let url = `${API_BASE}${path}`;
  if (cacheBust && !url.includes('?')) {
    url += `?_t=${Date.now()}`;
  }
  return url;
}

export default resolveImage;
