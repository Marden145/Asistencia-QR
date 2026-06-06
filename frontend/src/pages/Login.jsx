import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
const TITLE = 'BIENVENIDO';
const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login }    = useAuth();
  const navigate     = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await authService.login(data);
      // Guarda el usuario y token en el contexto
      login(result.user, result.token);
      // Redirige al dashboard
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };
  const inputBase = `
    w-full bg-white/5 border border-blue-300/15 rounded-xl
    pl-10 pr-4 py-3 text-sm text-blue-50 placeholder-blue-300/30
    outline-none focus:border-blue-400/50 focus:bg-blue-500/5
    transition-all duration-200 font-sans
  `;

  return (
    <div className="min-h-screen flex items-center justify-center p-8"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-3xl p-10"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '0.5px solid rgba(147,197,253,0.18)',
          backdropFilter: 'blur(24px)'
        }}
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(147,197,253,0.2)'
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="rgba(147,197,253,0.65)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </motion.div>

        {/* Título — letras animadas */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-0 mb-2" aria-label={TITLE}>
            {TITLE.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + i * 0.05,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
                style={{
                  display: 'inline-block',
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#93c5fd',
                  letterSpacing: '0.14em',
                  fontFamily: 'inherit'
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-xs tracking-widest"
            style={{ color: 'rgba(147,197,253,0.4)' }}
          >
            Sistema de asistencia QR
          </motion.p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45, ease: 'easeOut' }}
          >
            <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase"
              style={{ color: 'rgba(147,197,253,0.5)' }}>
              Correo electrónico
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15"
                viewBox="0 0 24 24" fill="none" stroke="rgba(147,197,253,0.4)" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                type="email"
                placeholder="correo@empresa.com"
                className={inputBase}
                style={errors.email ? { borderColor: 'rgba(239,68,68,0.5)' } : {}}
                {...register('email', { required: 'El email es requerido' })}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} className="text-xs mt-1.5"
                  style={{ color: 'rgba(239,68,68,0.8)' }}>
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.45, ease: 'easeOut' }}
          >
            <label className="block text-xs font-medium mb-1.5 tracking-widest uppercase"
              style={{ color: 'rgba(147,197,253,0.5)' }}>
              Contraseña
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15"
                viewBox="0 0 24 24" fill="none" stroke="rgba(147,197,253,0.4)" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                placeholder="••••••••"
                className={inputBase}
                style={errors.password ? { borderColor: 'rgba(239,68,68,0.5)' } : {}}
                {...register('password', { required: 'La contraseña es requerida' })}
              />
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} className="text-xs mt-1.5"
                  style={{ color: 'rgba(239,68,68,0.8)' }}>
                  {errors.password.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          {/* Error global */}
          <AnimatePresence>
            {errors.root && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl px-4 py-3 text-xs text-center"
                style={{ background: 'rgba(239,68,68,0.1)', color: 'rgba(239,68,68,0.9)', border: '0.5px solid rgba(239,68,68,0.2)' }}
              >
                {errors.root.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.45 }}
            className="pt-2"
          >
            <motion.button
              type="submit"
              whileHover={{ y: -2, opacity: 0.92 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="w-full py-3.5 rounded-2xl text-white text-xs font-medium tracking-widest uppercase border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}
            >
              Iniciar sesión
            </motion.button>
          </motion.div>

        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="flex items-center gap-3 mt-6"
        >
          <div className="flex-1 h-px" style={{ background: 'rgba(147,197,253,0.08)' }} />
          <span className="text-xs" style={{ color: 'rgba(147,197,253,0.25)' }}>
            acceso restringido
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(147,197,253,0.08)' }} />
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Login;