import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence }         from 'framer-motion';
import { useState }                        from 'react';
import { useAuth }                         from '../context/AuthContext';

const LINKS = [
  { to: '/personas',                  label: 'Personas'       },
  { to: '/escanear',                  label: 'Escanear'       },
  { to: '/asistencia',                label: 'Asistencia'     },
  { to: '/dashboard',                 label: 'Dashboard'      },
  { to: '/inventario',                label: 'Inventario'     },
  { to: '/personas-junta-directiva',  label: 'Junta Directiva'},
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuAbierto(false);
  };

  const handleLinkClick = () => setMenuAbierto(false);

  return (
    <nav
      style={{
        background: 'rgba(11,17,32,0.85)',
        borderBottom: '0.5px solid rgba(147,197,253,0.1)',
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 40,
        // Evita que CUALQUIER hijo empuje el ancho del nav más allá del viewport
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
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

        {/* Links — solo visibles en desktop/tablet */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}
                className="relative px-4 py-2 rounded-xl text-xs font-medium transition-colors duration-150 whitespace-nowrap"
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

        {/* Usuario y logout — solo visibles en desktop/tablet */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <span className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
            {user?.email}
          </span>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
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

        {/* Botón hamburguesa — solo visible en móvil */}
        <button
          onClick={() => setMenuAbierto(prev => !prev)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border-none cursor-pointer flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#93c5fd' }}
          aria-label="Abrir menú"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {menuAbierto ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Menú desplegable — solo en móvil */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '0.5px solid rgba(147,197,253,0.08)' }}
          >
            <div className="flex flex-col px-4 py-3 gap-1">
              {LINKS.map(link => {
                const active = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to}
                    onClick={handleLinkClick}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150"
                    style={{
                      color: active ? '#93c5fd' : 'rgba(147,197,253,0.55)',
                      background: active ? 'rgba(59,130,246,0.1)' : 'transparent',
                      textDecoration: 'none'
                    }}>
                    {link.label}
                  </Link>
                );
              })}

              <div style={{ height: '0.5px', background: 'rgba(147,197,253,0.08)', margin: '8px 0' }} />

              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl text-xs border-none cursor-pointer"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    color: 'rgba(252,165,165,0.7)',
                    border: '0.5px solid rgba(239,68,68,0.15)'
                  }}
                >
                  Salir
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
