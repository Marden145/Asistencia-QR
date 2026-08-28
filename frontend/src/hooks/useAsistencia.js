import { useState, useEffect, useCallback } from 'react';
import { getWeek, getYear }                 from 'date-fns';
import asistenciaService                    from '../services/asistencia.service';
import pagoService                          from '../services/pago.service';

const useAsistencia = () => {

  const hoy = new Date();

  const [semana,   setSemana]   = useState(getWeek(hoy, { weekStartsOn: 1 }));
  const [año,      setAño]      = useState(getYear(hoy));
  const [metricas, setMetricas] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [resumenPagos, setResumenPagos] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await asistenciaService.getMetricas(semana, año);
      const resumen = await pagoService.obtenerResumenDashboard(hoy.getMonth() + 1, hoy.getFullYear());
      setResumenPagos(resumen);
      setMetricas(data);
    } catch (err) {
      setError('Error al cargar métricas');
    } finally {
      setLoading(false);
    }
  }, [semana, año]); // cuando cambia semana o año, recarga

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { metricas, loading, error, semana, año, setSemana, setAño, resumenPagos };
};

export default useAsistencia;