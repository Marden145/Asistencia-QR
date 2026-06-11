import { useState, useEffect, useCallback } from 'react';
import personaJuntaDirectiva from '../services/personaJuntaDirectiva.service';

const usePersonasJunta = () => {

  const [personas, setPersonas] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // useCallback evita que esta función se recree en cada render
  // Solo se recrea si sus dependencias cambian — en este caso nunca
  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await personaJuntaDirectiva.getAll();
      setPersonas(data);
    } catch (err) {
      setError('Error al cargar las personas');
    } finally {
      // finally se ejecuta siempre, haya error o no
      setLoading(false);
    }
  }, []);

  // useEffect corre cargar() cuando el componente se monta
  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = async (data) => {
    await personaJuntaDirectiva.create(data);
    await cargar(); // recarga la lista después de crear
  };

  const actualizar = async (id, data) => {
    await personaJuntaDirectiva.update(id, data);
    await cargar();
  };

  const eliminar = async (id) => {
    await personaJuntaDirectiva.delete(id);
    await cargar();
  };

  // Devuelve todo lo que los componentes necesitan
  return { personas, loading, error, crear, actualizar, eliminar, cargar };
};

export default usePersonasJunta;