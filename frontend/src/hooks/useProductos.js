import { useState, useEffect, useCallback } from 'react';
import productoService from '../services/producto.service';

const useProductos = () =>{
    const [productos, setProductos] = useState([]);
    const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productoService.getAll();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar los productos');
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
    await productoService.create(data);
    await cargar(); // recarga la lista después de crear
  };

  const actualizar = async (id, data) => {
    await productoService.update(id, data);
    await cargar();
  };

  const eliminar = async (id) => {
    await productoService.remove(id);
    await cargar();
  };
  const registrarEgresos = async (id,cantidad) => {
    await productoService.recordExpenses(id, cantidad);
    await cargar();
  };
  const registrarIngresos = async (id,cantidad) => {
    await productoService.recordRevenue(id, cantidad);
    await cargar();
  };
   return { productos, loading, error, crear, actualizar, eliminar, cargar, registrarEgresos, registrarIngresos };
};
export default useProductos;