import { motion }        from 'framer-motion';
import { format } from 'date-fns';
import { es }     from 'date-fns/locale';
import { useState } from 'react';

const WeeklyTable = ({ asistencias }) => {

  // Agrupa asistencias por persona
  const porPersona = asistencias.reduce((acc, asistencia) => {
    const id = asistencia.personaId;

    if (!acc[id]) {
      acc[id] = {
        persona:     asistencia.persona,
        asistencias: []
      };
    }

    acc[id].asistencias.push(asistencia);
    return acc;
  }, {});

  const filas = Object.values(porPersona);

  // 🌟 ESTADOS DE PAGINACIÓN
    const [paginaActual, setPaginaActual] = useState(1);
    const filasPorPagina = 25; // Cambia este número para mostrar más o menos filas por página
  
    // 🌟 LÓGICA DE PROCESAMIENTO
    const totalPaginas = Math.ceil(filas.length / filasPorPagina);
    
    // Obtener el índice inicial y final de las personas de la página activa
    const indiceInicial = (paginaActual - 1) * filasPorPagina;
    const filasPaginadas = filas.slice(indiceInicial, indiceInicial + filasPorPagina);
  
    // Manejadores de navegación seguros
    const paginaAnterior = () => {
      if (paginaActual > 1) setPaginaActual(p => p - 1);
    };
  
    const paginaSiguiente = () => {
      if (paginaActual < totalPaginas) setPaginaActual(p => p + 1);
    };


  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(147,197,253,0.1)'
      }}
    >
      {/* Header */}
      <div className="px-6 py-5"
        style={{ borderBottom: '0.5px solid rgba(147,197,253,0.08)' }}>
        <h3 className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
          Detalle semanal
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.4)' }}>
          Registro de asistencias por persona
        </p>
      </div>

      {filas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 gap-3">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke="rgba(147,197,253,0.2)" strokeWidth="1.2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <p className="text-sm" style={{ color: 'rgba(147,197,253,0.3)' }}>
            No hay registros esta semana
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Cabecera de la tabla */}
          <div className="grid grid-cols-3 px-6 py-3"
            style={{ borderBottom: '0.5px solid rgba(147,197,253,0.06)' }}>
            {['Persona', 'Presencias', 'Fechas registradas'].map(col => (
              <span key={col} className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'rgba(147,197,253,0.35)' }}>
                {col}
              </span>
            ))}
          </div>

          {/* Filas */}
          {filasPaginadas.map(({ persona, asistencias }, i) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.05, duration: 0.3 }}
              className="grid grid-cols-3 px-6 py-4 items-center transition-colors duration-150"
              style={{ borderTop: '0.5px solid rgba(147,197,253,0.05)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Persona */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                  style={{
                    background: 'rgba(59,130,246,0.1)',
                    color: '#93c5fd',
                    border: '0.5px solid rgba(147,197,253,0.15)'
                  }}>
                  {persona.nombre[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
                    {persona.nombre} {persona.apellido}
                  </p>
                  {persona.email && (
                    <p className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
                      {persona.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Conteo */}
              <div>
                <span className="text-xs font-medium px-3 py-1.5 rounded-lg"
                  style={{
                    background: 'rgba(34,197,94,0.08)',
                    color: '#86efac',
                    border: '0.5px solid rgba(34,197,94,0.15)'
                  }}>
                  {asistencias.length} {asistencias.length === 1 ? 'día' : 'días'}
                </span>
              </div>

              {/* Fechas */}
              <div className="flex flex-wrap gap-1.5">
                {asistencias.map(a => (
                  <span key={a.id} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{
                      background: 'rgba(59,130,246,0.08)',
                      color: '#93c5fd',
                      border: '0.5px solid rgba(59,130,246,0.15)'
                    }}>
                    {format(new Date(a.fecha), 'EEE d', { locale: es })}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* 🌟 FOOTER CON BOTONERA DE PAGINACIÓN */}
      {filas.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4"
          style={{ 
            background: '#0f172a',
            borderTop: '0.5px solid rgba(147,197,253,0.08)' 
          }}>
          
          {/* Información de la fila */}
          <span className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
            Mostrando <strong style={{ color: '#93c5fd' }}>{indiceInicial + 1}</strong> a <strong style={{ color: '#93c5fd' }}>{Math.min(indiceInicial + filasPorPagina, filas.length)}</strong> de <strong style={{ color: '#93c5fd' }}>{filas.length}</strong> asistencias registradas
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
    </motion.div>
  );
};

export default WeeklyTable;