import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence }          from 'framer-motion';
import sesionService                         from '../../services/sesion.service';

const SesionControl = ({ onSesionCambia }) => {
  const [sesionAbierta, setSesionAbierta] = useState(false);
  const [cargando,      setCargando]      = useState(false);
  const [resultado,     setResultado]     = useState(null);

  const cargarEstado = useCallback(async () => {
    try {
      const data = await sesionService.getEstado();
      setSesionAbierta(data.sesionAbierta);
    } catch {}
  }, []);

  useEffect(() => { cargarEstado(); }, [cargarEstado]);

  const handleAbrir = async () => {
    setCargando(true);
    try {
      await sesionService.abrir();
      setSesionAbierta(true);
      onSesionCambia?.(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al abrir sesión');
    } finally {
      setCargando(false);
    }
  };

  const handleCerrar = async () => {
    if (!window.confirm('¿Cerrar la sesión? Los que no escanearon quedarán como AUSENTES.')) return;

    setCargando(true);
    try {
      const data = await sesionService.cerrar();
      setSesionAbierta(false);
      setResultado(data);
      onSesionCambia?.(false);

      // Limpia el resultado después de 6 segundos
      setTimeout(() => setResultado(null), 6000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cerrar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md mb-6 rounded-3xl p-6"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `0.5px solid ${sesionAbierta ? 'rgba(34,197,94,0.2)' : 'rgba(147,197,253,0.12)'}`,
        backdropFilter: 'blur(24px)',
        transition: 'border-color 0.3s'
      }}
    >
      {/* Estado de la sesión */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ opacity: sesionAbierta ? [1, 0.4, 1] : 1 }}
            transition={{ duration: 1.5, repeat: sesionAbierta ? Infinity : 0 }}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: sesionAbierta ? '#22c55e' : '#475569' }}
          />
          <div>
            <p className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
              {sesionAbierta ? 'Sesión activa' : 'Sin sesión activa'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.4)' }}>
              {sesionAbierta
                ? 'Las personas pueden registrar asistencia'
                : 'Abre una sesión para tomar asistencia hoy'}
            </p>
          </div>
        </div>
      </div>

      {/* Botón principal */}
      <motion.button
        whileHover={{ y: -2, opacity: 0.92 }}
        whileTap={{ scale: 0.97 }}
        onClick={sesionAbierta ? handleCerrar : handleAbrir}
        disabled={cargando}
        className="w-full py-3 rounded-2xl text-sm font-medium text-white border-none cursor-pointer flex items-center justify-center gap-2"
        style={{
          background: sesionAbierta
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
          opacity: cargando ? 0.7 : 1,
          transition: 'background 0.3s'
        }}
      >
        {cargando ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 rounded-full border-2"
              style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
            />
            Procesando...
          </>
        ) : sesionAbierta ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
            </svg>
            Cerrar sesión y registrar ausentes
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 8 12 12 14 14"/>
            </svg>
            Abrir sesión de hoy
          </>
        )}
      </motion.button>

      {/* Resultado al cerrar */}
      <AnimatePresence>
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 overflow-hidden"
          >
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(147,197,253,0.1)'
              }}
            >
              <p className="text-xs font-medium mb-3" style={{ color: 'rgba(147,197,253,0.6)' }}>
                Resumen de la sesión
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl px-3 py-2 text-center"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.15)' }}>
                  <p className="text-lg font-medium" style={{ color: '#86efac' }}>
                    {resultado.totalPresentes}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(134,239,172,0.5)' }}>
                    presentes
                  </p>
                </div>
                <div className="rounded-xl px-3 py-2 text-center"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.15)' }}>
                  <p className="text-lg font-medium" style={{ color: '#fca5a5' }}>
                    {resultado.totalAusentes}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(252,165,165,0.5)' }}>
                    ausentes
                  </p>
                </div>
              </div>

              {resultado.ausentesNombres?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs mb-2" style={{ color: 'rgba(147,197,253,0.35)' }}>
                    Registrados como ausentes:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {resultado.ausentesNombres.map((nombre, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg"
                        style={{
                          background: 'rgba(239,68,68,0.08)',
                          color: 'rgba(252,165,165,0.7)',
                          border: '0.5px solid rgba(239,68,68,0.12)'
                        }}>
                        {nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SesionControl;