import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence }          from 'framer-motion';
import pagoService                          from '../../services/pago.service';

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];
const inputMonto = `
    w-full text-sm outline-none px-4 py-3 rounded-xl
    transition-all duration-200
  `;
const SemanaInput = ({ label, value, onChange }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium tracking-widest uppercase"
        style={{ color: 'rgba(147,197,253,0.45)' }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium"
          style={{ color: 'rgba(147,197,253,0.4)' }}>
          ₡
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={inputMonto}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(147,197,253,0.15)',
            color: '#e0f2fe',
            paddingLeft: '28px'
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(147,197,253,0.15)'}
        />
      </div>
    </div>
  );

const PagoModal = ({ persona, onCerrar }) => {
  const hoy = new Date();

  const [mes,      setMes]      = useState(hoy.getMonth() + 1);
  const [año,      setAño]      = useState(hoy.getFullYear());
  const [semana1,  setSemana1]  = useState('');
  const [semana2,  setSemana2]  = useState('');
  const [semana3,  setSemana3]  = useState('');
  const [semana4,  setSemana4]  = useState('');
  const [notas,    setNotas]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [historial, setHistorial] = useState([]);

  // Total calculado automáticamente con onChange
  const total = [semana1, semana2, semana3, semana4]
    .reduce((sum, v) => sum + (parseFloat(v) || 0), 0);

  // Carga el pago cuando cambia mes o año
  const cargarPago = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pagoService.obtenerPorMes(persona.id, mes, año);
      setSemana1(data.semana1 || '');
      setSemana2(data.semana2 || '');
      setSemana3(data.semana3 || '');
      setSemana4(data.semana4 || '');
      setNotas(data.notas   || '');
    } catch {
      setSemana1(''); setSemana2('');
      setSemana3(''); setSemana4('');
      setNotas('');
    } finally {
      setLoading(false);
    }
  }, [persona.id, mes, año]);

  // Carga historial al abrir el modal
  const cargarHistorial = useCallback(async () => {
    try {
      const data = await pagoService.historial(persona.id);
      setHistorial(data);
    } catch {}
  }, [persona.id]);

  useEffect(() => { cargarPago(); }, [cargarPago]);
  useEffect(() => { cargarHistorial(); }, [cargarHistorial]);

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      await pagoService.guardar({
        personaId: persona.id,
        mes, año,
        semana1: parseFloat(semana1) || 0,
        semana2: parseFloat(semana2) || 0,
        semana3: parseFloat(semana3) || 0,
        semana4: parseFloat(semana4) || 0,
        notas
      });
      setGuardado(true);
      await cargarHistorial();
      setTimeout(() => setGuardado(false), 2500);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  

  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onCerrar()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full rounded-3xl overflow-hidden flex"
        style={{
          maxWidth: '780px',
          background: 'rgba(11,17,32,0.97)',
          border: '0.5px solid rgba(147,197,253,0.15)',
          backdropFilter: 'blur(24px)',
          maxHeight: '90vh'
        }}
      >

        {/* Panel izquierdo — formulario */}
        <div className="flex-1 p-8 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '0.5px solid rgba(59,130,246,0.2)'
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#93c5fd" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <path d="M2 10h20"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium" style={{ color: '#e0f2fe' }}>
                  Pagos mensuales
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.4)' }}>
                  {persona.nombre} {persona.apellido}
                </p>
              </div>
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

          {/* Selector mes y año */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-widest uppercase"
                style={{ color: 'rgba(147,197,253,0.45)' }}>
                Mes
              </label>
              <div className="relative">
                <select
                  value={mes}
                  onChange={e => setMes(Number(e.target.value))}
                  className="w-full text-sm outline-none appearance-none px-4 py-3 rounded-xl cursor-pointer pr-8"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '0.5px solid rgba(147,197,253,0.15)',
                    color: '#93c5fd'
                  }}
                >
                  {MESES.map((m, i) => (
                    <option key={i} value={i + 1}
                      style={{ background: '#0f172a', color: '#e0f2fe' }}>
                      {m}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(147,197,253,0.4)" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium tracking-widest uppercase"
                style={{ color: 'rgba(147,197,253,0.45)' }}>
                Año
              </label>
              <input
                type="number"
                value={año}
                onChange={e => setAño(Number(e.target.value))}
                className="w-full text-sm outline-none px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(147,197,253,0.15)',
                  color: '#93c5fd'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                onBlur={e  => e.target.style.borderColor = 'rgba(147,197,253,0.15)'}
              />
            </div>
          </div>

          {/* Inputs de semanas */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 rounded-full border-2"
                  style={{ borderColor: 'rgba(59,130,246,0.2)', borderTopColor: '#3b82f6' }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="formulario-inputs"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <SemanaInput label="Semana 1" value={semana1} onChange={setSemana1} />
                  <SemanaInput label="Semana 2" value={semana2} onChange={setSemana2} />
                  <SemanaInput label="Semana 3" value={semana3} onChange={setSemana3} />
                  <SemanaInput label="Semana 4" value={semana4} onChange={setSemana4} />
                </div>

                {/* Total — calculado en tiempo real */}
                <div className="rounded-2xl p-4 mt-2"
                  style={{
                    background: 'rgba(59,130,246,0.06)',
                    border: '0.5px solid rgba(59,130,246,0.15)'
                  }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase"
                        style={{ color: 'rgba(147,197,253,0.5)' }}>
                        Total del mes
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(147,197,253,0.3)' }}>
                        Suma de las 4 semanas
                      </p>
                    </div>
                    <motion.span
                      key={total}
                      initial={{ scale: 0.9, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-2xl font-medium"
                      style={{ color: '#93c5fd' }}
                    >
                      ₡{total.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </motion.span>
                  </div>
                </div>

                {/* Notas */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium tracking-widest uppercase"
                    style={{ color: 'rgba(147,197,253,0.45)' }}>
                    Notas
                    <span className="ml-2 normal-case tracking-normal"
                      style={{ color: 'rgba(147,197,253,0.3)', fontSize: '10px' }}>
                      opcional
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Observaciones del mes..."
                    value={notas}
                    onChange={e => setNotas(e.target.value)}
                    className="w-full text-sm outline-none px-4 py-3 rounded-xl resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '0.5px solid rgba(147,197,253,0.15)',
                      color: '#e0f2fe'
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                    onBlur={e  => e.target.style.borderColor = 'rgba(147,197,253,0.15)'}
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onCerrar}
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
                    whileHover={{ y: -1, opacity: 0.92 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGuardar}
                    disabled={guardando}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-white border-none cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      background: guardado
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      opacity: guardando ? 0.7 : 1,
                      transition: 'background 0.3s'
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {guardando ? (
                        <motion.div
                          key="guardando"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 rounded-full border-2"
                            style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                          />
                          Guardando...
                        </motion.div>
                      ) : guardado ? (
                        <motion.div
                          key="guardado"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Guardado
                        </motion.div>
                      ) : (
                        <motion.span
                          key="guardar"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Guardar cambios
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divisor vertical */}
        <div style={{ width: '0.5px', background: 'rgba(147,197,253,0.08)', flexShrink: 0 }} />

        {/* Panel derecho — historial */}
        <div className="w-64 p-6 overflow-y-auto flex-shrink-0">
          <p className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: 'rgba(147,197,253,0.4)' }}>
            Historial
          </p>

          {historial.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="rgba(147,197,253,0.15)" strokeWidth="1.2">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <path d="M2 10h20"/>
              </svg>
              <p className="text-xs text-center" style={{ color: 'rgba(147,197,253,0.25)' }}>
                Sin registros anteriores
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {historial.map((pago, i) => (
                <motion.button
                  key={pago.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  onClick={() => { setMes(pago.mes); setAño(pago.año); }}
                  className="w-full text-left rounded-xl px-3 py-3 border-none cursor-pointer transition-colors duration-150"
                  style={{
                    background: (pago.mes === mes && pago.año === año)
                      ? 'rgba(59,130,246,0.1)'
                      : 'rgba(255,255,255,0.03)',
                    border: `0.5px solid ${(pago.mes === mes && pago.año === año)
                      ? 'rgba(59,130,246,0.25)'
                      : 'rgba(147,197,253,0.08)'}`
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: '#93c5fd' }}>
                      {MESES[pago.mes - 1]} {pago.año}
                    </span>
                    {(pago.mes === mes && pago.año === año) && (
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }} />
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(147,197,253,0.5)' }}>
                    ₡{Number(pago.total).toLocaleString('es-CR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </motion.button>
              ))}
            </div>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
};

export default PagoModal;