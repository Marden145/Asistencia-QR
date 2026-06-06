import { motion }    from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const QRDisplay = ({ persona, onCerrar }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl p-8 text-center w-full max-w-xs"
        style={{
          background: 'rgba(11,17,32,0.97)',
          border: '0.5px solid rgba(147,197,253,0.15)',
          backdropFilter: 'blur(24px)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <p className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
              {persona.nombre} {persona.apellido}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.4)' }}>
              Código de asistencia
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCerrar}
            className="w-8 h-8 rounded-xl flex items-center justify-center border-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(147,197,253,0.5)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </motion.button>
        </div>

        {/* QR */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
          className="rounded-2xl p-5 inline-block mb-4"
          style={{ background: 'white' }}
        >
          <QRCodeSVG value={persona.codigoQR} size={180} level="H" />
        </motion.div>

        {/* UUID */}
        <div className="mb-6">
          <code className="text-xs px-3 py-1.5 rounded-lg font-mono"
            style={{
              background: 'rgba(99,102,241,0.1)',
              color: 'rgba(165,180,252,0.6)',
              border: '0.5px solid rgba(99,102,241,0.15)',
              letterSpacing: '0.03em'
            }}>
            {persona.codigoQR}
          </code>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium border-none cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(147,197,253,0.6)',
              border: '0.5px solid rgba(147,197,253,0.12)'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Imprimir
          </motion.button>

          <motion.button
            whileHover={{ y: -1, opacity: 0.92 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCerrar}
            className="flex-1 py-2.5 rounded-xl text-xs font-medium text-white border-none cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}
          >
            Cerrar
          </motion.button>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default QRDisplay;