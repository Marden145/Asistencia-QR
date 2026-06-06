import { createContext, useContext, useState } from 'react';

// 1. Crear el contexto — es como crear el "contenedor" global
const AuthContext = createContext(null);
// 2. El Provider — el componente que envuelve la app y comparte los datos
export const AuthProvider = ({ children }) => {

  // Inicializa el estado leyendo localStorage
  // Si el usuario ya estaba logueado antes, lo recupera automáticamente
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user')) || null
  );

  // Se llama cuando el login es exitoso
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // Notifica al SessionProvider que hay un token nuevo
    window.dispatchEvent(new CustomEvent('session:nueva', { detail: { token } }));
  };

  // Se llama cuando el usuario cierra sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Comparte user, login y logout con toda la app
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// 3. Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => useContext(AuthContext);