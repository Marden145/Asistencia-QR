import { useEffect }               from 'react';
import { useForm }                 from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

const PersonaForm = ({ persona, onSubmit, onCancelar }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (persona) {
    reset({
      ...persona,
      fechaNacimiento: persona.fechaNacimiento 
        ? new Date(persona.fechaNacimiento).toISOString().split('T')[0] 
        : ''
    });
  } else {
      reset({ nombre: '', apellido: '', fechaNacimiento: '' });
    }
  }, [persona, reset]);

  const inputClass = `
    w-full bg-white/5 border border-blue-300/15 rounded-xl
    px-4 py-3 text-sm text-blue-50 placeholder-blue-300/25
    outline-none focus:border-blue-400/50 focus:bg-blue-500/5
    transition-all duration-200
  `;

  const Field = ({ label, name, type = 'text', required, placeholder }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium tracking-widest uppercase"
        style={{ color: 'rgba(147,197,253,0.5)' }}>
        {label} {required && <span style={{ color: 'rgba(239,68,68,0.6)' }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={inputClass}
        style={errors[name] ? { borderColor: 'rgba(239,68,68,0.4)' } : {}}
        {...register(name, required ? { required: `${label} es requerido` } : {})}
      />
      <AnimatePresence>
        {errors[name] && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs"
            style={{ color: 'rgba(239,68,68,0.75)' }}
          >
            {errors[name].message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onCancelar()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background: 'rgba(11,17,32,0.95)',
          border: '0.5px solid rgba(147,197,253,0.15)',
          backdropFilter: 'blur(24px)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-base font-medium" style={{ color: '#e0f2fe' }}>
              {persona ? 'Editar persona' : 'Nueva persona'}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.4)' }}>
              {persona ? 'Modifica los datos del registro' : 'Completa los datos del nuevo registro'}
            </p>
          </div>
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

        {/* Campos */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre"   name="nombre"   required placeholder="Juan" />
            <Field label="Apellido" name="apellido" required placeholder="Pérez" />
            <Field label="Fecha de nacimiento" name="fechaNacimiento" type="date" required />
          </div>
          
          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onCancelar}
              className="flex-1 py-3 rounded-xl text-sm font-medium border-none cursor-pointer transition-colors duration-150"
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
              className="flex-1 py-3 rounded-xl text-sm font-medium text-white border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}
            >
              {persona ? 'Guardar cambios' : 'Crear persona'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PersonaForm;