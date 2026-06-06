import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const agregar = useCallback((tipo, titulo, mensaje, duracion = 4000) => {
    const id = crypto.randomUUID();

    setToasts(prev => [...prev, { id, tipo, titulo, mensaje }]);

    // Se elimina automáticamente después de la duración
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duracion);

    return id;
  }, []);

  const eliminar = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Métodos de conveniencia por tipo
  const exito   = useCallback((titulo, mensaje, duracion) =>
    agregar('exito',   titulo, mensaje, duracion), [agregar]);

  const error   = useCallback((titulo, mensaje, duracion) =>
    agregar('error',   titulo, mensaje, duracion), [agregar]);

  const info    = useCallback((titulo, mensaje, duracion) =>
    agregar('info',    titulo, mensaje, duracion), [agregar]);

  const alerta  = useCallback((titulo, mensaje, duracion) =>
    agregar('alerta',  titulo, mensaje, duracion), [agregar]);

  return { toasts, exito, error, info, alerta, eliminar };
};