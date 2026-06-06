import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// Interceptor — adjunta el token automáticamente en cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response — captura 401 y dispara el evento de sesión expirada
// Usamos un evento global para no crear dependencia circular
// con el contexto de React
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Dispara evento global que SessionProvider escucha
      window.dispatchEvent(new CustomEvent('session:expirada'));
    }
    return Promise.reject(error);
  }
);

export default api;