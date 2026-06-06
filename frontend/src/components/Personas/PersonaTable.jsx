import { motion, AnimatePresence } from 'framer-motion';

const PersonaTable = ({ personas, onEditar, onEliminar, onVerQR, onVerPagos  }) => {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '0.5px solid rgba(147,197,253,0.12)' }}>

      {/* Header de la tabla */}
      <div className="grid grid-cols-6 px-6 py-3.5"
        style={{ background: '#0f172a' }}>
        {['Nombre', 'Apellido', 'Email', 'Teléfono', 'Código QR', 'Acciones'].map(col => (
          <span key={col} className="text-xs font-medium tracking-widest uppercase"
            style={{ color: 'rgba(147,197,253,0.45)' }}>
            {col}
          </span>
        ))}
      </div>

      {/* Filas */}
      <div style={{ background: '#0b1120' }}>
        <AnimatePresence>
          {personas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
            personas.map((persona, i) => (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: 'easeOut' }}
                className="grid grid-cols-6 px-6 py-4 items-center group transition-colors duration-150"
                style={{
                  borderTop: '0.5px solid rgba(147,197,253,0.06)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Nombre con avatar inicial */}
                <div className="flex items-center gap-3">
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

                <span className="text-sm" style={{ color: 'rgba(224,242,254,0.7)' }}>
                  {persona.apellido}
                </span>

                <span className="text-sm" style={{ color: 'rgba(147,197,253,0.55)' }}>
                  {persona.email || '—'}
                </span>

                <span className="text-sm" style={{ color: 'rgba(147,197,253,0.55)' }}>
                  {persona.telefono || '—'}
                </span>

                {/* Código QR */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-1 rounded-lg"
                    style={{
                      background: 'rgba(99,102,241,0.1)',
                      color: 'rgba(165,180,252,0.7)',
                      border: '0.5px solid rgba(99,102,241,0.15)',
                      letterSpacing: '0.05em'
                    }}>
                    {persona.codigoQR.substring(0, 8)}…
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  {/* Ver QR */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onVerQR(persona)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 border-none cursor-pointer"
                    style={{
                      background: 'rgba(99,102,241,0.12)',
                      color: '#a5b4fc',
                      border: '0.5px solid rgba(99,102,241,0.2)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.12)'}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                    </svg>
                    QR
                  </motion.button>
                    {/* Ver Pagos */}
                    <motion.button
    whileHover={{ scale: 1.05, y: -1 }}
    whileTap={{ scale: 0.96 }}
    onClick={() => onVerPagos(persona)}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
    style={{
      background: 'rgba(251,191,36,0.08)',
      color: '#fcd34d',
      border: '0.5px solid rgba(251,191,36,0.18)'
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,191,36,0.15)'}
    onMouseLeave={e => e.currentTarget.style.background = 'rgba(251,191,36,0.08)'}
  >
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <path d="M2 10h20"/>
    </svg>
    Pagos
  </motion.button>

                  {/* Editar */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onEditar(persona)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
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
                    onClick={() => onEliminar(persona.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
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
  );
};

export default PersonaTable;