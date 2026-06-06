import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence }          from 'framer-motion';
import { getWeek, getYear }                 from 'date-fns';
import asistenciaService                    from '../services/asistencia.service';

const DIAS       = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
const DIAS_LABEL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

const Asistencia = () => {
  const hoy = new Date();

  const [semana,  setSemana]  = useState(getWeek(hoy, { weekStartsOn: 1 }));
  const [año,     setAño]     = useState(getYear(hoy));
  const [tabla,   setTabla]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await asistenciaService.getTabla(semana, año);
      setTabla(data.tabla);
    } catch {
      setError('Error al cargar la tabla de asistencia');
    } finally {
      setLoading(false);
    }
  }, [semana, año]);

  useEffect(() => { cargar(); }, [cargar]);

  const semanaAnterior = () => {
    if (semana === 1) { setSemana(52); setAño(a => a - 1); }
    else setSemana(s => s - 1);
  };

  const semanaSiguiente = () => {
    if (semana === 52) { setSemana(1); setAño(a => a + 1); }
    else setSemana(s => s + 1);
  };

  // Celda de cada día — tres estados posibles
  // Modifica tu componente CeldaDia en el Frontend:
const CeldaDia = ({ registros }) => {
  // Si el array está vacío, significa que no hubo ninguna sesión ese día
  if (!registros || registros.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <span style={{ color: 'rgba(147,197,253,0.15)', fontSize: '16px' }}>—</span>
      </div>
    );
  }

  // Si hay elementos, mapeamos cada sesión del día (pueden ser 1, 2 o más)
  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      {registros.map((reg) => (
        <motion.div
          key={reg.id}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
        >
          {reg.estado === 'PRESENTE' ? (
            /* Tu div verde del PRESENTE */
            <div className="w-6 h-6 rounded-full flex items-center justify-center" // Bajé un toque el tamaño a w-6 h-6 por si se acumulan
              style={{ background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.2)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          ) : (
            /* Tu div rojo del AUSENTE */
            <div className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.15)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-2"
            style={{ borderColor: 'rgba(59,130,246,0.2)', borderTopColor: '#3b82f6' }}
          />
          <p className="text-sm" style={{ color: 'rgba(147,197,253,0.4)' }}>
            Cargando asistencia...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        <p className="text-sm" style={{ color: 'rgba(239,68,68,0.7)' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#e0f2fe' }}>
            Asistencia
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(147,197,253,0.4)' }}>
            Semana {semana} — {año}
          </p>
        </div>

        {/* Navegación de semanas */}
        <div className="flex items-center gap-1 rounded-2xl p-1"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(147,197,253,0.12)'
          }}>
          <motion.button
            whileHover={{ x: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={semanaAnterior}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border-none cursor-pointer transition-colors duration-150"
            style={{ color: 'rgba(147,197,253,0.6)', background: 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Anterior
          </motion.button>

          <div className="px-4 py-2">
            <span className="text-xs font-medium" style={{ color: '#93c5fd' }}>
              Semana {semana}
            </span>
          </div>

          <motion.button
            whileHover={{ x: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={semanaSiguiente}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border-none cursor-pointer transition-colors duration-150"
            style={{ color: 'rgba(147,197,253,0.6)', background: 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Siguiente
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(147,197,253,0.1)'
        }}
      >
        {/* Cabecera de la tabla */}
        <div
          className="grid px-6 py-4"
          style={{
            gridTemplateColumns: '2fr repeat(5, 1fr) auto',
            borderBottom: '0.5px solid rgba(147,197,253,0.08)',
            background: 'rgba(0,0,0,0.15)'
          }}
        >
          <span className="text-xs font-medium tracking-widest uppercase"
            style={{ color: 'rgba(147,197,253,0.4)' }}>
            Persona
          </span>
          {DIAS_LABEL.map(dia => (
            <span key={dia}
              className="text-xs font-medium tracking-widest uppercase text-center"
              style={{ color: 'rgba(147,197,253,0.4)' }}>
              {dia}
            </span>
          ))}
          <span className="text-xs font-medium tracking-widest uppercase text-center"
            style={{ color: 'rgba(147,197,253,0.4)', minWidth: '64px' }}>
            Total
          </span>
        </div>

        {/* Filas */}
<AnimatePresence>
  {tabla.length === 0 ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-3"
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
        stroke="rgba(147,197,253,0.2)" strokeWidth="1.2">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
      <p className="text-sm" style={{ color: 'rgba(147,197,253,0.3)' }}>
        No hay sesiones registradas esta semana
      </p>
      <p className="text-xs" style={{ color: 'rgba(147,197,253,0.2)' }}>
        Abre una sesión desde la página de Escanear
      </p>
    </motion.div>
  ) : (
    tabla.map(({ persona, dias }, i) => {
      // 1. Contamos cuántas asistencias individuales marcadas como 'PRESENTE' hay en toda la semana
      const totalPresentes = DIAS.reduce((acumulador, dia) => {
        const presentesDelDia = dias[dia]?.filter(reg => reg.estado === 'PRESENTE').length || 0;
        return acumulador + presentesDelDia;
      }, 0);

      // 2. Contamos el total real de sesiones que se abrieron en la semana para esa persona
      const totalSesiones = DIAS.reduce((acumulador, dia) => {
        return acumulador + (dias[dia]?.length || 0);
      }, 0);

      // Color del badge según porcentaje de asistencia
      const porcentaje = totalSesiones > 0
        ? (totalPresentes / totalSesiones) * 100
        : 0;

      const badgeStyle = porcentaje === 100
        ? { bg: 'rgba(34,197,94,0.1)',   color: '#86efac',  border: 'rgba(34,197,94,0.2)'  }
        : porcentaje >= 60
        ? { bg: 'rgba(251,191,36,0.1)',  color: '#fcd34d',  border: 'rgba(251,191,36,0.2)' }
        : { bg: 'rgba(239,68,68,0.08)',  color: '#fca5a5',  border: 'rgba(239,68,68,0.15)' };

      return (
        <motion.div
          key={persona.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
          className="grid px-6 py-4 items-center transition-colors duration-150"
          style={{
            gridTemplateColumns: '2fr repeat(5, 1fr) auto',
            borderTop: '0.5px solid rgba(147,197,253,0.05)'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {/* Persona */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
              style={{
                background: 'rgba(59,130,246,0.1)',
                color: '#93c5fd',
                border: '0.5px solid rgba(147,197,253,0.15)'
              }}
            >
              {persona.nombre[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
                {persona.nombre} {persona.apellido}
              </p>
              {persona.email && (
                <p className="text-xs" style={{ color: 'rgba(147,197,253,0.35)' }}>
                  {persona.email}
                </p>
              )}
            </div>
          </div>

          {/* Celda por día — Pasamos la lista completa de ese día */}
          {DIAS.map(dia => (
            <div key={dia} className="flex items-center justify-center">
              <CeldaDia registros={dias[dia] || []} />
            </div>
          ))}

          {/* Badge total */}
          <div className="flex items-center justify-center" style={{ minWidth: '64px' }}>
            {totalSesiones === 0 ? (
              <span className="text-xs" style={{ color: 'rgba(147,197,253,0.2)' }}>
                —
              </span>
            ) : (
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-lg"
                style={{
                  background: badgeStyle.bg,
                  color:      badgeStyle.color,
                  border:     `0.5px solid ${badgeStyle.border}`
                }}
              >
                {totalPresentes}/{totalSesiones}
              </span>
            )}
          </div>

        </motion.div>
      );
    })
  )}
</AnimatePresence>

        {/* Leyenda */}
        {tabla.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-6 px-6 py-4"
            style={{ borderTop: '0.5px solid rgba(147,197,253,0.06)' }}
          >
            <span className="text-xs" style={{ color: 'rgba(147,197,253,0.3)' }}>
              Leyenda:
            </span>

            {[
              {
                label: 'Presente',
                icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
                bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)'
              },
              {
                label: 'Ausente',
                icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
                bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)'
              },
              {
                label: 'Sin sesión',
                icon: <span style={{ color: 'rgba(147,197,253,0.15)', fontSize: '12px' }}>—</span>,
                bg: 'transparent', border: 'transparent'
              }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: item.bg, border: `0.5px solid ${item.border}` }}>
                  {item.icon}
                </div>
                <span className="text-xs" style={{ color: 'rgba(147,197,253,0.35)' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

      </motion.div>
    </div>
  );
};

export default Asistencia;