import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
const ProductoTable = ({ productos, onEditar, onEliminar }) => {
   // 🌟 ESTADOS DE PAGINACIÓN
    const [paginaActual, setPaginaActual] = useState(1);
    const filasPorPagina = 25; // Cambia este número para mostrar más o menos filas por página
  
    // 🌟 LÓGICA DE PROCESAMIENTO
    const totalPaginas = Math.ceil(productos.length / filasPorPagina);
    
    // Obtener el índice inicial y final de los productos de la página activa
    const indiceInicial = (paginaActual - 1) * filasPorPagina;
    const productosPaginados = productos.slice(indiceInicial, indiceInicial + filasPorPagina);
  
    // Manejadores de navegación seguros
    const paginaAnterior = () => {
      if (paginaActual > 1) setPaginaActual(p => p - 1);
    };
  
    const paginaSiguiente = () => {
      if (paginaActual < totalPaginas) setPaginaActual(p => p + 1);
    };
return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '0.5px solid rgba(147,197,253,0.12)' }}>

      {/* Header de la tabla */}
      <div className="grid grid-cols-6 px-6 py-3.5"
        style={{ background: '#0f172a' }}>
        {['Nombre', 'Descripción', 'Stock', 'Precio','Acciones'].map(col => (
          <span key={col} className="text-xs font-medium tracking-widest uppercase"
            style={{ color: 'rgba(147,197,253,0.45)' }}>
            {col}
          </span>
        ))}
      </div>

      {/* Filas */}
      <div style={{ background: '#0b1120' }}>
        <AnimatePresence>
          {productosPaginados.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 gap-3"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="rgba(147,197,253,0.2)" strokeWidth="1.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span className="text-sm" style={{ color: 'rgba(147,197,253,0.3)' }}>
                No hay productos registrados
              </span>
            </motion.div>
          ) : (
            productosPaginados.map((producto, i) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: 'easeOut' }}
                className="grid grid-cols-6 px-6 py-4 items-center group transition-colors duration-150"
                style={{
                  borderTop: '0.5px solid rgba(147,197,253,0.06)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Nombre */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
                    {producto.nombre}
                  </span>
                </div>

                <span className="text-sm" style={{ color: 'rgba(224,242,254,0.7)' }}>
                  {producto.descripcion}
                </span>

                <span className="text-sm" style={{ color: 'rgba(147,197,253,0.55)' }}>
                  {producto.cantidad}
                </span>

                <span className="text-sm" style={{ color: 'rgba(147,197,253,0.55)' }}>
                  ₡{producto.precio.toFixed(2)}
                </span>
                {/* Acciones */}
                <div className="flex items-center gap-2">
                  
                  {/* Editar */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onEditar(producto)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
                    style={{
                      background: 'rgba(59,130,246,0.12)',
                      color: '#93c5fd',
                      border: '0.5px solid rgba(59,130,246,0.2)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.12)'}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                  </motion.button>

                  {/* Eliminar */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onEliminar(producto)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      color: 'rgba(252,165,165,0.8)',
                      border: '0.5px solid rgba(239,68,68,0.15)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                    Eliminar
                  </motion.button>
                </div>

              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      {/* 🌟 FOOTER CON BOTONERA DE PAGINACIÓN */}
      {productos.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4"
          style={{ 
            background: '#0f172a',
            borderTop: '0.5px solid rgba(147,197,253,0.08)' 
          }}>
          
          {/* Información de la fila */}
          <span className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
            Mostrando <strong style={{ color: '#93c5fd' }}>{indiceInicial + 1}</strong> a <strong style={{ color: '#93c5fd' }}>{Math.min(indiceInicial + filasPorPagina, productos.length)}</strong> de <strong style={{ color: '#93c5fd' }}>{productos.length}</strong> productos
          </span>

          {/* Botones de control */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={paginaActual > 1 ? { x: -2 } : {}}
              whileTap={paginaActual > 1 ? { scale: 0.95 } : {}}
              onClick={paginaAnterior}
              disabled={paginaActual === 1}
              className="flex items-center justify-center p-2 rounded-xl text-xs font-medium border-none cursor-pointer transition-colors duration-150"
              style={{ 
                color: paginaActual === 1 ? 'rgba(147,197,253,0.2)' : 'rgba(147,197,253,0.6)', 
                background: 'rgba(255,255,255,0.03)',
                cursor: paginaActual === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </motion.button>

            <span className="text-xs font-medium px-2" style={{ color: '#93c5fd' }}>
              Página {paginaActual} de {totalPaginas || 1}
            </span>

            <motion.button
              whileHover={paginaActual < totalPaginas ? { x: 2 } : {}}
              whileTap={paginaActual < totalPaginas ? { scale: 0.95 } : {}}
              onClick={paginaSiguiente}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
              className="flex items-center justify-center p-2 rounded-xl text-xs font-medium border-none cursor-pointer transition-colors duration-150"
              style={{ 
                color: (paginaActual === totalPaginas || totalPaginas === 0) ? 'rgba(147,197,253,0.2)' : 'rgba(147,197,253,0.6)', 
                background: 'rgba(255,255,255,0.03)',
                cursor: (paginaActual === totalPaginas || totalPaginas === 0) ? 'not-allowed' : 'pointer'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

};
export default ProductoTable;