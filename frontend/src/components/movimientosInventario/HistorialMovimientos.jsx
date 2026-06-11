import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence }          from 'framer-motion';
import movimientosInventarioService from  '../../services/movimientosInventario.service';

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

const HistorialMovimientos = () => {
  const hoy = new Date();

  const [mes,          setMes]          = useState(hoy.getMonth() + 1);
  const [año,          setAño]          = useState(hoy.getFullYear());
  const [movimientos,  setMovimientos]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movimientosInventarioService.historialMovimientos(mes, año);
      setMovimientos(data);
    } catch {
      setError('Error al cargar el historial de movimientos');
    } finally {
      setLoading(false);
    }
  }, [mes, año]);

  useEffect(() => { cargar(); }, [cargar]);

  // Métricas calculadas del mes
  const totalIngresos  = movimientos.filter(m => m.tipo === 'INGRESO').length;
  const totalEgresos   = movimientos.filter(m => m.tipo === 'EGRESO').length;
  const unidadesIn     = movimientos
    .filter(m => m.tipo === 'INGRESO')
    .reduce((s, m) => s + m.cantidad, 0);
  const unidadesOut    = movimientos
    .filter(m => m.tipo === 'EGRESO')
    .reduce((s, m) => s + m.cantidad, 0);

  const formatFecha = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-CR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };
  // 🌟 ESTADOS DE PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 25; // Cambia este número para mostrar más o menos filas por página

  // 🌟 LÓGICA DE PROCESAMIENTO
  const totalPaginas = Math.ceil(movimientos.length / filasPorPagina);
  
  // Obtener el índice inicial y final de los movimientos de la página activa
  const indiceInicial = (paginaActual - 1) * filasPorPagina;
  const movimientosPaginados = movimientos.slice(indiceInicial, indiceInicial + filasPorPagina);

  // Manejadores de navegación seguros
  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(p => p - 1);
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(p => p + 1);
  };

  return (
    <div
      className=" p-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#e0f2fe' }}>
            Historial de movimientos
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(147,197,253,0.4)' }}>
            {MESES[mes - 1]} {año} — {movimientos.length} movimientos
          </p>
        </div>

        {/* Filtro mes y año */}
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-3"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(147,197,253,0.12)'
          }}
        >
          <div className="relative">
            <select
              value={mes}
              onChange={e => setMes(Number(e.target.value))}
              className="text-sm outline-none appearance-none cursor-pointer bg-transparent pr-6 font-medium"
              style={{ color: '#93c5fd' }}
            >
              {MESES.map((m, i) => (
                <option key={i} value={i + 1}
                  style={{ background: '#0f172a', color: '#e0f2fe' }}>
                  {m}
                </option>
              ))}
            </select>
            <svg className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
              width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="rgba(147,197,253,0.4)" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          <div className="w-px h-4" style={{ background: 'rgba(147,197,253,0.12)' }} />

          <input
            type="number"
            value={año}
            onChange={e => setAño(Number(e.target.value))}
            className="w-16 text-sm font-medium outline-none bg-transparent text-center"
            style={{ color: '#93c5fd' }}
          />
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Ingresos',
            valor: totalIngresos,
            sub: `${unidadesIn} unidades`,
            color: '#86efac',
            bg: 'rgba(34,197,94,0.08)',
            border: 'rgba(34,197,94,0.15)',
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="#22c55e" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <polyline points="19 12 12 19 5 12"/>
              </svg>
            )
          },
          {
            label: 'Egresos',
            valor: totalEgresos,
            sub: `${unidadesOut} unidades`,
            color: '#fca5a5',
            bg: 'rgba(239,68,68,0.08)',
            border: 'rgba(239,68,68,0.15)',
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="#ef4444" strokeWidth="2.5">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
              </svg>
            )
          },
          {
            label: 'Total movimientos',
            valor: movimientos.length,
            sub: `${MESES[mes - 1]} ${año}`,
            color: '#93c5fd',
            bg: 'rgba(59,130,246,0.08)',
            border: 'rgba(59,130,246,0.15)',
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="#3b82f6" strokeWidth="2">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>
              </svg>
            )
          },
          {
            label: 'Balance neto',
            valor: unidadesIn - unidadesOut,
            sub: 'unidades netas',
            color: (unidadesIn - unidadesOut) >= 0 ? '#86efac' : '#fca5a5',
            bg: (unidadesIn - unidadesOut) >= 0
              ? 'rgba(34,197,94,0.08)'
              : 'rgba(239,68,68,0.08)',
            border: (unidadesIn - unidadesOut) >= 0
              ? 'rgba(34,197,94,0.15)'
              : 'rgba(239,68,68,0.15)',
            icon: (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke={(unidadesIn - unidadesOut) >= 0 ? '#22c55e' : '#ef4444'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    
    {/* La letra "C" del colón (dibujada con un arco) */}
    <path d="M18 6a9 9 0 1 0 0 12" />
    
    {/* Las dos líneas verticales */}
    <line x1="10" y1="2" x2="10" y2="22" />
    <line x1="14" y1="2" x2="14" y2="22" />
  </svg>
)
          }
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: card.bg,
              border: `0.5px solid ${card.border}`
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'rgba(147,197,253,0.45)' }}>
                {card.label}
              </span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.15)' }}>
                {card.icon}
              </div>
            </div>
            <span className="text-3xl font-medium" style={{ color: card.color }}>
              {card.valor}
            </span>
            <span className="text-xs" style={{ color: 'rgba(147,197,253,0.35)' }}>
              {card.sub}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Tabla de movimientos */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(147,197,253,0.1)'
        }}
      >
        {/* Cabecera */}
        <div
          className="grid px-6 py-4"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
            borderBottom: '0.5px solid rgba(147,197,253,0.08)',
            background: 'rgba(0,0,0,0.15)'
          }}
        >
          {['Producto', 'Tipo', 'Cantidad', 'Stock anterior', 'Stock nuevo', 'Fecha'].map(col => (
            <span key={col}
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: 'rgba(147,197,253,0.4)' }}>
              {col}
            </span>
          ))}
        </div>

        {/* Filas */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-16 gap-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 rounded-full border-2"
                style={{ borderColor: 'rgba(59,130,246,0.2)', borderTopColor: '#3b82f6' }}
              />
              <span className="text-sm" style={{ color: 'rgba(147,197,253,0.4)' }}>
                Cargando movimientos...
              </span>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 gap-3"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="rgba(239,68,68,0.4)" strokeWidth="1.2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm" style={{ color: 'rgba(239,68,68,0.6)' }}>{error}</p>
            </motion.div>
          ) : movimientos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 gap-3"
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="rgba(147,197,253,0.15)" strokeWidth="1.2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <p className="text-sm" style={{ color: 'rgba(147,197,253,0.3)' }}>
                Sin movimientos en {MESES[mes - 1]} {año}
              </p>
            </motion.div>
          ) : (
            <motion.div key="lista" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {movimientosPaginados.map((mov, i) => {
                const esIngreso = mov.tipo === 'INGRESO';
                return (
                  <motion.div
                    key={mov.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className="grid px-6 py-4 items-center transition-colors duration-150"
                    style={{
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                      borderTop: '0.5px solid rgba(147,197,253,0.05)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Producto */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: esIngreso
                            ? 'rgba(34,197,94,0.08)'
                            : 'rgba(239,68,68,0.08)',
                          border: `0.5px solid ${esIngreso
                            ? 'rgba(34,197,94,0.15)'
                            : 'rgba(239,68,68,0.15)'}`
                        }}>
                        {esIngreso ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="#22c55e" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <polyline points="19 12 12 19 5 12"/>
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="#f87171" strokeWidth="2.5">
                            <line x1="12" y1="19" x2="12" y2="5"/>
                            <polyline points="5 12 12 5 19 12"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
                          {mov.producto.nombre}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.4)' }}>
                          Stock actual: {mov.producto.cantidad}
                        </p>
                      </div>
                    </div>

                    {/* Tipo */}
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-lg w-fit"
                      style={{
                        background: esIngreso
                          ? 'rgba(34,197,94,0.08)'
                          : 'rgba(239,68,68,0.08)',
                        color: esIngreso ? '#86efac' : '#fca5a5',
                        border: `0.5px solid ${esIngreso
                          ? 'rgba(34,197,94,0.2)'
                          : 'rgba(239,68,68,0.2)'}`
                      }}
                    >
                      {mov.tipo}
                    </span>

                    {/* Cantidad */}
                    <span
                      className="text-sm font-medium"
                      style={{ color: esIngreso ? '#86efac' : '#fca5a5' }}
                    >
                      {esIngreso ? '+' : '-'}{mov.cantidad}
                    </span>

                    {/* Stock anterior */}
                    <span className="text-sm" style={{ color: 'rgba(147,197,253,0.55)' }}>
                      {mov.stockAnterior}
                    </span>

                    {/* Stock nuevo */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium" style={{ color: '#e0f2fe' }}>
                        {mov.stockNuevo}
                      </span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke={esIngreso ? '#22c55e' : '#ef4444'} strokeWidth="2.5">
                        {esIngreso
                          ? <polyline points="18 15 12 9 6 15"/>
                          : <polyline points="6 9 12 15 18 9"/>
                        }
                      </svg>
                    </div>

                    {/* Fecha */}
                    <span className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
                      {formatFecha(mov.fecha)}
                    </span>

                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        {/* 🌟 FOOTER CON BOTONERA DE PAGINACIÓN */}
      {movimientos.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4"
          style={{ 
            background: '#0f172a',
            borderTop: '0.5px solid rgba(147,197,253,0.08)' 
          }}>
          
          {/* Información de la fila */}
          <span className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>
            Mostrando <strong style={{ color: '#93c5fd' }}>{indiceInicial + 1}</strong> a <strong style={{ color: '#93c5fd' }}>{Math.min(indiceInicial + filasPorPagina, movimientos.length)}</strong> de <strong style={{ color: '#93c5fd' }}>{movimientos.length}</strong> movimientos
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
      </motion.div>
    </div>
  );
};

export default HistorialMovimientos;