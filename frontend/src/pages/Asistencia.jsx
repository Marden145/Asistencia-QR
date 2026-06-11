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
    // 🌟 ESTADOS DE PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 25; // Cambia este número para mostrar más o menos filas por página

  // 🌟 LÓGICA DE PROCESAMIENTO
  const totalPaginas = Math.ceil(tabla.length / filasPorPagina);
  
  // Obtener el índice inicial y final de las personas de la página activa
  const indiceInicial = (paginaActual - 1) * filasPorPagina;
  const tablaPaginadas = tabla.slice(indiceInicial, indiceInicial + filasPorPagina);

  // Manejadores de navegación seguros
  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(p => p - 1);
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(p => p + 1);
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
            gridTemplateColumns: '2fr 1.5fr 1.2fr 1fr 1.5fr',
            borderBottom: '0.5px solid rgba(147,197,253,0.08)',
            background: 'rgba(0,0,0,0.15)'
          }}
        >
          <span className="text-xs font-medium tracking-widest uppercase"
            style={{ color: 'rgba(147,197,253,0.4)' }}>
            Persona
          </span>
          <span className="text-xs font-medium tracking-widest uppercase text-center"
            style={{ color: 'rgba(147,197,253,0.4)' }}>
            Asistencia (Martes)
          </span>
          <span className="text-xs font-medium tracking-widest uppercase text-center"
            style={{ color: 'rgba(147,197,253,0.4)' }}>
            Monto Semana
          </span>
          <span className="text-xs font-medium tracking-widest uppercase text-center"
            style={{ color: 'rgba(147,197,253,0.4)' }}>
            N° Recibo
          </span>
          <span className="text-xs font-medium tracking-widest uppercase text-center"
            style={{ color: 'rgba(147,197,253,0.4)' }}>
            Estado Semanal
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
            </motion.div>
          ) : (
            tablaPaginadas.map(({ persona, asistencia, reporteFinanciero }, i) => {
              // Extraemos el registro de asistencia del martes
              const registroMartes = asistencia?.martes?.[0];
              
              // Variable de control para saber si no hay data de asistencia
              const sinRegistro = !registroMartes;
              
              // Forzamos el estado a AUSENTE si no viene ningún registro
              const estadoAsistencia = sinRegistro ? 'AUSENTE' : registroMartes.estado;

              // Lógica de validación financiera basada en tus especificaciones
              const montoValido = sinRegistro ? 0 : (reporteFinanciero?.monto || 0);
              const reciboValido = sinRegistro ? '—' : (reporteFinanciero?.recibo || '—');
              
              // Si no hay registro de asistencia, el estado financiero pasa forzado a PENDIENTE
              const estadoFinanciero = sinRegistro ? 'PENDIENTE' : (reporteFinanciero?.estado || 'PENDIENTE');

              // Estilos dinámicos y estilizados para los estados financieros (Estética Neón Suave)
              const financialBadgeStyle = estadoFinanciero === 'CANCELADO'
                ? { bg: 'rgba(34,197,94,0.08)', color: '#4ade80', border: 'rgba(34,197,94,0.25)' }
                : { bg: 'rgba(239,68,68,0.06)', color: '#f87171', border: 'rgba(239,68,68,0.2)' };

                

              return (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
                  className="grid px-6 py-4 items-center transition-colors duration-150"
                  style={{
                    gridTemplateColumns: '2fr 1.5fr 1.2fr 1fr 1.5fr',
                    borderTop: '0.5px solid rgba(147,197,253,0.05)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* 1. Columna Persona */}
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
                    </div>
                  </div>

                  {/* 2. Columna Asistencia (Martes) */}
                  <div className="flex items-center justify-center">
                    <CeldaDia registros={sinRegistro ? [] : asistencia.martes} />
                  </div>

                  {/* 3. Columna Monto Semana */}
                  <div className="text-center text-sm font-medium" style={{ color: montoValido > 0 ? '#e0f2fe' : 'rgba(147,197,253,0.3)' }}>
                    {montoValido > 0 ? `₡${montoValido.toLocaleString('es-CR')}` : '—'}
                  </div>

                  {/* 4. Columna Número de Recibo */}
                  <div className="text-center text-sm" style={{ color: reciboValido !== '—' ? '#93c5fd' : 'rgba(147,197,253,0.3)' }}>
                    {reciboValido !== '—' && !reciboValido.startsWith('Recibo') ? `#${reciboValido}` : reciboValido}
                  </div>

                  {/* 5. Columna Estado Semanal */}
                  <div className="flex items-center justify-center">
                    <span
                      className="text-xs font-medium px-3 py-1 rounded-full tracking-wide min-w-[90px] text-center"
                      style={{
                        background: financialBadgeStyle.bg,
                        color: financialBadgeStyle.color,
                        border: `1px solid ${financialBadgeStyle.border}`
                      }}
                    >
                      {estadoFinanciero === 'CANCELADO' ? 'Cancelado' : 'Pendiente'}
                    </span>
                  </div>

                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        {/* 🌟 FOOTER CON BOTONERA DE PAGINACIÓN */}
      {tabla.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4"
          style={{ 
            background: '#0f172a',
            borderTop: '0.5px solid rgba(147,197,253,0.08)' 
          }}>
          
          {/* Información de la fila */}
          <span className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
            Mostrando <strong style={{ color: '#93c5fd' }}>{indiceInicial + 1}</strong> a <strong style={{ color: '#93c5fd' }}>{Math.min(indiceInicial + filasPorPagina, tabla.length)}</strong> de <strong style={{ color: '#93c5fd' }}>{tabla.length}</strong> asistencias
          </span>

          {/* Botones de control */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={paginaActual > 1 ? { x: -2 } : {}}
              whileTap={paginaActual > 1 ? { scale: 0.95 } : {}}
              onClick={paginaAnterior}
              disabled={paginaActual === 1}
              className="flex items-center justify-center p-2 rounded-xl text-xs font-medium border-none cursor-pointer transition-colors duration-150"
              style={{ 
                color: paginaActual === 1 ? 'rgba(147,197,253,0.2)' : 'rgba(147,197,253,0.6)', 
                background: 'rgba(255,255,255,0.03)',
                cursor: paginaActual === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </motion.button>

            <span className="text-xs font-medium px-2" style={{ color: '#93c5fd' }}>
              Página {paginaActual} de {totalPaginas || 1}
            </span>

            <motion.button
              whileHover={paginaActual < totalPaginas ? { x: 2 } : {}}
              whileTap={paginaActual < totalPaginas ? { scale: 0.95 } : {}}
              onClick={paginaSiguiente}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
              className="flex items-center justify-center p-2 rounded-xl text-xs font-medium border-none cursor-pointer transition-colors duration-150"
              style={{ 
                color: (paginaActual === totalPaginas || totalPaginas === 0) ? 'rgba(147,197,253,0.2)' : 'rgba(147,197,253,0.6)', 
                background: 'rgba(255,255,255,0.03)',
                cursor: (paginaActual === totalPaginas || totalPaginas === 0) ? 'not-allowed' : 'pointer'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </motion.button>
          </div>
        </div>
      )}

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
                label: 'Ausente / Sin Registro',
                icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
                bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)'
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