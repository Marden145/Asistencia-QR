import { useEffect, useRef }       from 'react';
import { motion }                  from 'framer-motion';

const CONFIG = {
  exito: {
    color:      '#86efac',
    bg:         'rgba(34,197,94,0.08)',
    border:     'rgba(34,197,94,0.2)',
    barColor:   '#22c55e',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    )
  },
  error: {
    color:      '#fca5a5',
    bg:         'rgba(239,68,68,0.08)',
    border:     'rgba(239,68,68,0.2)',
    barColor:   '#ef4444',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    )
  },
  info: {
    color:      '#93c5fd',
    bg:         'rgba(59,130,246,0.08)',
    border:     'rgba(59,130,246,0.2)',
    barColor:   '#3b82f6',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    )
  },
  alerta: {
    color:      '#fcd34d',
    bg:         'rgba(251,191,36,0.08)',
    border:     'rgba(251,191,36,0.2)',
    barColor:   '#f59e0b',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )
  }
};

const ToastItem = ({ toast, onEliminar }) => {
  const config    = CONFIG[toast.tipo] || CONFIG.info;
  const barRef    = useRef(null);

  // Anima la barra de progreso con CSS animation
  useEffect(() => {
    if (!barRef.current) return;
    barRef.current.style.animation = 'toast-progress 4s linear forwards';
  }, []);

  return (
    <>
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.2 } }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl w-full"
        style={{
          background:   config.bg,
          border:       `0.5px solid ${config.border}`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Contenido */}
        <div className="flex items-start gap-3 px-4 py-4">

          {/* Ícono */}
          <div className="flex-shrink-0 mt-0.5">
            {config.icon}
          </div>

          {/* Texto */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: config.color }}>
              {toast.titulo}
            </p>
            {toast.mensaje && (
              <p className="text-xs mt-0.5 leading-relaxed"
                style={{ color: 'rgba(147,197,253,0.55)' }}>
                {toast.mensaje}
              </p>
            )}
          </div>

          {/* Botón cerrar */}
          <button
            onClick={() => onEliminar(toast.id)}
            className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors duration-150 mt-0.5"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(147,197,253,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Barra de progreso */}
        <div
          ref={barRef}
          className="absolute bottom-0 left-0 h-0.5"
          style={{ background: config.barColor, width: '100%' }}
        />
      </motion.div>
    </>
  );
};

export default ToastItem;