import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion }                          from 'framer-motion';
import { useAuth }                         from '../context/AuthContext';

const LINKS = [
  { to: '/personas',   label: 'Personas'   },
  { to: '/escanear',   label: 'Escanear'   },
  { to: '/asistencia', label: 'Asistencia' },
  { to: '/dashboard',  label: 'Dashboard'  },
  { to: '/inventario',  label: 'Inventario'  },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();

  return (
    <nav className="px-8 py-4 flex items-center justify-between"
      style={{
        background: 'rgba(11,17,32,0.85)',
        borderBottom: '0.5px solid rgba(147,197,253,0.1)',
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 40
      }}>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
          </svg>
        </div>
        <span className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
          AsistenciaQR
        </span>
      </div>

      {/* Links */}
      <div className="flex items-center gap-1">
        {LINKS.map(link => {
          const active = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}
              className="relative px-4 py-2 rounded-xl text-xs font-medium transition-colors duration-150"
              style={{ color: active ? '#93c5fd' : 'rgba(147,197,253,0.45)', textDecoration: 'none' }}>
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '0.5px solid rgba(59,130,246,0.2)' }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className="relative">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Usuario y logout */}
      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
          {user?.email}
        </span>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { logout(); navigate('/login'); }}
          className="px-3 py-1.5 rounded-xl text-xs border-none cursor-pointer transition-colors duration-150"
          style={{
            background: 'rgba(239,68,68,0.08)',
            color: 'rgba(252,165,165,0.7)',
            border: '0.5px solid rgba(239,68,68,0.15)'
          }}
        >
          Salir
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;
