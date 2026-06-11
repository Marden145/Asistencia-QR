import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, onClose, onConfirm, titulo, mensaje, botonConfirmarText = "Confirmar", tipo = "alerta" }) => {
  
  // Paleta a juego con tus Toasts
  const COLORES = {
    alerta: {
      border: 'rgba(251,191,36,0.2)',
      bg: 'rgba(15, 23, 42, 0.75)', // Slate 900 con opacidad para el blur
      btnBg: '#f59e0b',
      btnHover: '#d97706',
      iconColor: '#f59e0b',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      )
    },
    error: {
      border: 'rgba(239,68,68,0.2)',
      bg: 'rgba(15, 23, 42, 0.75)',
      btnBg: '#ef4444',
      btnHover: '#dc2626',
      iconColor: '#ef4444',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      )
    }
  };

  const estilo = COLORES[tipo] || COLORES.alerta;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* Backdrop/Overlay Traslúcido */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Caja del Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl w-full max-w-md p-6 shadow-2xl border"
            style={{
              background: estilo.bg,
              borderColor: estilo.border,
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-start gap-4">
              {/* Contenedor del Ícono */}
              <div className="flex-shrink-0 p-2 rounded-xl bg-white/5" style={{ color: estilo.iconColor }}>
                {estilo.icon}
              </div>

              {/* Textos */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-100 leading-6">
                  {titulo}
                </h3>
                <p className="text-sm mt-2 text-slate-400 leading-relaxed">
                  {mensaje}
                </p>
              </div>
            </div>

            {/* Botonera inferior */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-xl text-slate-300 bg-white/5 hover:bg-white/10 transition-colors duration-150 cursor-pointer border-none"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium rounded-xl text-white transition-colors duration-150 cursor-pointer border-none shadow-lg shadow-black/20"
                style={{ backgroundColor: estilo.btnBg }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = estilo.btnHover}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = estilo.btnBg}
              >
                {botonConfirmarText}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;