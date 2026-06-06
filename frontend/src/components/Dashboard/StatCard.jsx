import { motion } from 'framer-motion';

const StatCard = ({ titulo, valor, subtitulo, accentColor, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(147,197,253,0.1)',
        backdropFilter: 'blur(16px)'
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-widest uppercase"
          style={{ color: 'rgba(147,197,253,0.45)' }}>
          {titulo}
        </span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: accentColor ? `${accentColor}18` : 'rgba(59,130,246,0.1)' }}>
          {icon}
        </div>
      </div>

      <div className="text-4xl font-medium" style={{ color: accentColor || '#93c5fd' }}>
        {valor}
      </div>

      {subtitulo && (
        <p className="text-xs" style={{ color: 'rgba(147,197,253,0.35)' }}>
          {subtitulo}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;