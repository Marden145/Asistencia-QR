import { createContext, useContext, useState,
         useEffect, useRef, useCallback }    from 'react';
import { tokenExpirado, tiempoHastaExpiracion } from '../utils/token';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [expirada, setExpirada] = useState(false);
  const timerRef = useRef(null);

  const limpiarTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Programa el modal para cuando expire el token
  const programarExpiracion = useCallback((token) => {
    limpiarTimer();
    if (!token) return;

    const ms = tiempoHastaExpiracion(token);

    // Si ya expiró al programar, mostrar inmediatamente
    if (ms <= 0) {
      setExpirada(true);
      return;
    }

    timerRef.current = setTimeout(() => {
      setExpirada(true);
    }, ms);
  }, []);

  const resetearExpiracion = useCallback(() => {
    limpiarTimer();
    setExpirada(false);
  }, []);

  // Al montar, verifica el token que ya existe en localStorage
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  if (tokenExpirado(token)) {
    setExpirada(true);
  } else {
    programarExpiracion(token);
  }

  // Escucha el evento del interceptor de Axios
  const handleExpiracion = () => setExpirada(true);
  window.addEventListener('session:expirada', handleExpiracion);
  // Cuando el usuario inicia sesión nuevo, reprograma el timer
  const handleNuevaSesion = (e) => {
    resetearExpiracion();
    programarExpiracion(e.detail.token);
  };
  window.addEventListener('session:nueva', handleNuevaSesion);

  return () => {
    limpiarTimer();
    window.removeEventListener('session:expirada', handleExpiracion);
    window.removeEventListener('session:nueva', handleNuevaSesion);
  };
}, [programarExpiracion]);

  return (
    <SessionContext.Provider value={{ expirada, setExpirada, programarExpiracion, resetearExpiracion }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);