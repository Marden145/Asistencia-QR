import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const PersonasJuntaTable = ({ personas, onEditar, onEliminar }) => {
  // 🌟 ESTADOS DE PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 25;

  // 🌟 LÓGICA DE PROCESAMIENTO
  const totalPaginas = Math.ceil(personas.length / filasPorPagina);
  const indiceInicial = (paginaActual - 1) * filasPorPagina;
  const personasPaginadas = personas.slice(indiceInicial, indiceInicial + filasPorPagina);

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(p => p - 1);
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(p => p + 1);
  };

  return (
    <div className="rounded-2xl overflow-hidden w-full"
      style={{ border: '0.5px solid rgba(147,197,253,0.12)' }}>

      {/* 📱 💻 CONTENEDOR RESPONSIVE CON SCROLL HORIZONTAL EN MÓVILES */}
      <div className="w-full overflow-x-auto scrollbar-thin">
        {/* Forzamos un ancho mínimo en pantallas pequeñas para que el diseño mantenga su proporición original */}
        <div className="min-w-[1000px] w-full">
          
          {/* Header de la tabla (Corregido a grid-cols-12 para cuadrar la matemática de spans) */}
          <div className="grid grid-cols-12 px-6 py-3.5 items-center"
            style={{ background: '#0f172a' }}>
            
            <span className="col-span-2 text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(147,197,253,0.45)' }}>Nombre</span>
            <span className="col-span-2 text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(147,197,253,0.45)' }}>Apellido</span>
            <span className="col-span-2 text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(147,197,253,0.45)' }}>Cédula</span>
            <span className="col-span-2 text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(147,197,253,0.45)' }}>Teléfono</span>
            <span className="col-span-1 text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(147,197,253,0.45)' }}>Puesto</span>
            <span className="col-span-3 text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(147,197,253,0.45)' }}>Acciones</span>
          </div>

          {/* Filas */}
          <div style={{ background: '#0b1120' }}>
            <AnimatePresence mode="wait">
              {personasPaginadas.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 gap-3"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(147,197,253,0.2)" strokeWidth="1.2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span className="text-sm" style={{ color: 'rgba(147,197,253,0.3)' }}>
                    No hay personas registradas
                  </span>
                </motion.div>
              ) : (
                personasPaginadas.map((persona, i) => (
                  <motion.div
                    key={persona.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: i * 0.03, duration: 0.25, ease: 'easeOut' }}
                    // 🌟 Alineado perfecto con grid-cols-12
                    className="grid grid-cols-12 px-6 py-4 items-center group transition-colors duration-150"
                    style={{
                      borderTop: '0.5px solid rgba(147,197,253,0.06)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Nombre con avatar inicial (col-span-2) */}
                    <div className="flex items-center gap-3 col-span-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium"
                        style={{
                          background: 'rgba(59,130,246,0.12)',
                          color: '#93c5fd',
                          border: '0.5px solid rgba(147,197,253,0.15)'
                        }}>
                        {persona.nombre[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
                        {persona.nombre}
                      </span>
                    </div>

                    {/* Apellido (col-span-2) */}
                    <span className="text-sm col-span-2" style={{ color: 'rgba(224,242,254,0.7)' }}>
                      {persona.apellido}
                    </span>

                    {/* Cédula (col-span-2) */}
                    <span className="text-sm col-span-2" style={{ color: '#e0f2fe' }}>
                      {persona.cedula}
                    </span>

                    {/* Teléfono (col-span-2) */}
                    <span className="text-sm col-span-2" style={{ color: 'rgba(224,242,254,0.7)' }}>
                      {persona.telefono}
                    </span>

                    {/* Puesto (col-span-1) */}
                    <span className="text-sm col-span-1" style={{ color: '#e0f2fe' }}>
                      {persona.puesto}
                    </span>
                    {/* Acciones (col-span-3 - Botones alineados horizontalmente de forma ejecutiva) */}
                    <div className="flex items-center gap-1.5 col-span-3">
                      {/* Ver Pagos */}
                      {/* Editar */}
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onEditar(persona)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
                        style={{
                          background: 'rgba(59,130,246,0.12)',
                          color: '#93c5fd',
                          border: '0.5px solid rgba(59,130,246,0.2)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.12)'}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Editar
                      </motion.button>

                      {/* Eliminar */}
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onEliminar(persona)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
                        style={{
                          background: 'rgba(239,68,68,0.08)',
                          color: 'rgba(252,165,165,0.8)',
                          border: '0.5px solid rgba(239,68,68,0.15)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                        Eliminar
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* 🌟 FOOTER CON BOTONERA DE PAGINACIÓN (Se adapta al ancho móvil por fuera del scroll) */}
      {personas.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between px-6 py-4"
          style={{ 
            background: '#0f172a',
            borderTop: '0.5px solid rgba(147,197,253,0.08)' 
          }}>
          
          {/* Información de la fila */}
          <span className="text-xs text-center sm:text-left" style={{ color: 'rgba(147,197,253,0.4)' }}>
            Mostrando <strong style={{ color: '#93c5fd' }}>{indiceInicial + 1}</strong> a <strong style={{ color: '#93c5fd' }}>{Math.min(indiceInicial + filasPorPagina, personas.length)}</strong> de <strong style={{ color: '#93c5fd' }}>{personas.length}</strong> personas
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
    </div>
  );
};

export default PersonasJuntaTable;