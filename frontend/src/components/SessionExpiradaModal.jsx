import { useEffect }               from 'react';
import { useNavigate }             from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth }                 from '../context/AuthContext';
import { useSession }              from '../context/SessionContext';

const SessionExpiradaModal = () => {
  const { expirada, resetearExpiracion } = useSession();
  const { logout }                       = useAuth();
  const navigate                         = useNavigate();

  // Bloquea el scroll del body mientras el modal está abierto
  useEffect(() => {
    if (expirada) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [expirada]);

  const handleIrAlLogin = () => {
    logout();
    resetearExpiracion();
    navigate('/login', { replace: true });
  };

  const handleCerrarSesion = () => {
    logout();
    resetearExpiracion();
    navigate('/login', { replace: true });
  };

  return (
    <AnimatePresence>
      {expirada && (
        <>
          {/* Overlay — bloquea toda interacción */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
            // Captura clicks para que no pasen al contenido de abajo
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
          >
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm rounded-3xl p-8 text-center"
              style={{
                background: 'rgba(11,17,32,0.98)',
                border: '0.5px solid rgba(239,68,68,0.2)',
                backdropFilter: 'blur(24px)'
              }}
              // Evita que clicks dentro del modal cierren nada
              onMouseDown={e => e.stopPropagation()}
            >
              {/* Ícono animado */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.4, 0.64, 1] }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '0.5px solid rgba(239,68,68,0.2)'
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(239,68,68,0.8)" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                  {/* Candado abierto — simboliza sesión terminada */}
                  <circle cx="12" cy="16" r="1" fill="rgba(239,68,68,0.8)"/>
                </svg>
              </motion.div>

              {/* Texto */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                <h2 className="text-lg font-medium mb-2" style={{ color: '#fca5a5' }}>
                  Sesión expirada
                </h2>
                <p className="text-sm leading-relaxed mb-1"
                  style={{ color: 'rgba(224,242,254,0.7)' }}>
                  Tu sesión ha expirado por inactividad.
                </p>
                <p className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
                  Por seguridad, debes iniciar sesión nuevamente para continuar.
                </p>
              </motion.div>

              {/* Indicador de tiempo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex items-center justify-center gap-2 my-6 py-3 rounded-2xl"
                style={{
                  background: 'rgba(239,68,68,0.05)',
                  border: '0.5px solid rgba(239,68,68,0.1)'
                }}
              >
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#ef4444' }}
                />
                <span className="text-xs" style={{ color: 'rgba(252,165,165,0.6)' }}>
                  Sesión inactiva — acceso suspendido
                </span>
              </motion.div>

              {/* Botones */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.35 }}
                className="flex flex-col gap-3"
              >
                {/* Volver a iniciar sesión — acción principal */}
                <motion.button
                  whileHover={{ y: -2, opacity: 0.92 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleIrAlLogin}
                  className="w-full py-3.5 rounded-2xl text-sm font-medium text-white border-none cursor-pointer flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Iniciar sesión nuevamente
                </motion.button>

                {/* Cerrar sesión — acción secundaria */}
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCerrarSesion}
                  className="w-full py-3 rounded-2xl text-sm font-medium border-none cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(147,197,253,0.5)',
                    border: '0.5px solid rgba(147,197,253,0.1)'
                  }}
                >
                  Cerrar sesión
                </motion.button>
              </motion.div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SessionExpiradaModal;