import { useEffect }               from 'react';
import { useForm }                 from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

const MovimientoForm = ({ tipo, productos, onSubmit, onCancelar }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Limpia el form cada vez que se abre
  useEffect(() => {
    reset({ productoId: '', cantidad: '' });
  }, [tipo, reset]);

  const esIngreso = tipo === 'ingreso';

  const accentColor = esIngreso
    ? { color: '#86efac', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)'  }
    : { color: '#fca5a5', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)'  };

  const gradiente = esIngreso
    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';

  const inputClass = `
    w-full bg-white/5 border border-blue-300/15 rounded-xl
    px-4 py-3 text-sm text-blue-50 placeholder-blue-300/25
    outline-none focus:border-blue-400/50 focus:bg-blue-500/5
    transition-all duration-200
  `;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onCancelar()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background: 'rgba(11,17,32,0.97)',
          border: `0.5px solid ${accentColor.border}`,
          backdropFilter: 'blur(24px)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">

            {/* Ícono de tipo */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: accentColor.bg, border: `0.5px solid ${accentColor.border}` }}>
              {esIngreso ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={accentColor.color} strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="19 12 12 19 5 12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={accentColor.color} strokeWidth="2.5">
                  <line x1="12" y1="19" x2="12" y2="5"/>
                  <polyline points="5 12 12 5 19 12"/>
                </svg>
              )}
            </div>

            <div>
              <h3 className="text-base font-medium" style={{ color: '#e0f2fe' }}>
                Registrar {esIngreso ? 'ingreso' : 'egreso'}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.4)' }}>
                {esIngreso
                  ? 'Suma stock al producto seleccionado'
                  : 'Resta stock al producto seleccionado'}
              </p>
            </div>
          </div>

          {/* Botón cerrar */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancelar}
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Select de producto */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-widest uppercase"
              style={{ color: 'rgba(147,197,253,0.5)' }}>
              Producto <span style={{ color: 'rgba(239,68,68,0.6)' }}>*</span>
            </label>

            <div className="relative">
              <select
                className={inputClass}
                style={errors.productoId ? { borderColor: 'rgba(239,68,68,0.4)' } : {}}
                {...register('productoId', { required: 'Selecciona un producto' })}
              >
                <option value="" style={{ background: '#0f172a' }}>
                  — Selecciona un producto —
                </option>
                {productos.map(p => (
                  <option
                    key={p.id}
                    value={p.id}
                    style={{ background: '#0f172a', color: '#e0f2fe' }}
                  >
                    {p.nombre} — Stock actual: {p.cantidad}
                  </option>
                ))}
              </select>

              {/* Flecha del select */}
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="rgba(147,197,253,0.4)" strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            <AnimatePresence>
              {errors.productoId && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs"
                  style={{ color: 'rgba(239,68,68,0.75)' }}
                >
                  {errors.productoId.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Cantidad */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-widest uppercase"
              style={{ color: 'rgba(147,197,253,0.5)' }}>
              Cantidad <span style={{ color: 'rgba(239,68,68,0.6)' }}>*</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="Ej: 10"
              className={inputClass}
              style={errors.cantidad ? { borderColor: 'rgba(239,68,68,0.4)' } : {}}
              {...register('cantidad', {
                required: 'La cantidad es requerida',
                min: { value: 1, message: 'La cantidad debe ser mayor a 0' }
              })}
            />
            <AnimatePresence>
              {errors.cantidad && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs"
                  style={{ color: 'rgba(239,68,68,0.75)' }}
                >
                  {errors.cantidad.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onCancelar}
              className="flex-1 py-3 rounded-xl text-sm font-medium border-none cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(147,197,253,0.6)',
                border: '0.5px solid rgba(147,197,253,0.12)'
              }}
            >
              Cancelar
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ y: -1, opacity: 0.92 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-white border-none cursor-pointer flex items-center justify-center gap-2"
              style={{ background: gradiente }}
            >
              {esIngreso ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <polyline points="19 12 12 19 5 12"/>
                  </svg>
                  Registrar ingreso
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2.5">
                    <line x1="12" y1="19" x2="12" y2="5"/>
                    <polyline points="5 12 12 5 19 12"/>
                  </svg>
                  Registrar egreso
                </>
              )}
            </motion.button>
          </div>

        </form>
      </motion.div>
    </motion.div>
  );
};

export default MovimientoForm;