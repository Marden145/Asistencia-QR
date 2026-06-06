import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode }                 from 'html5-qrcode';
import { motion, AnimatePresence }     from 'framer-motion';
import asistenciaService               from '../../services/asistencia.service';

const QRScanner = () => {
  const [resultado,  setResultado]  = useState(null);
  const [error,      setError]      = useState(null);
  const [escaneando, setEscaneando] = useState(false);
  const [camaras,    setCamaras]    = useState([]);
  const [camaraId,   setCamaraId]   = useState(null);
  const [activo,     setActivo]     = useState(false);

  const scannerRef    = useRef(null);
  const iniciandoRef  = useRef(false);
  const procesandoRef = useRef(false); // ← lock anti-duplicados

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices?.length) {
          setCamaras(devices);
          setCamaraId(devices[0].id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!camaraId) return;
    if (iniciandoRef.current) return;
    iniciandoRef.current = true;

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner.start(
      camaraId,
      { fps: 10, qrbox: { width: 220, height: 220 } },

      async (codigoQR) => {
        // Lock síncrono — bloquea todos los frames siguientes
        if (procesandoRef.current) return;
        procesandoRef.current = true;

        setEscaneando(true);
        setError(null);

        try {
          const data = await asistenciaService.registrarPorQR(codigoQR);
          setResultado(data);
        } catch (err) {
          setError(err.response?.data?.error || 'Error al registrar');
        } finally {
          setEscaneando(false);
          setTimeout(() => {
            setResultado(null);
            setError(null);
            procesandoRef.current = false; // libera el lock
          }, 3500);
        }
      },

      () => {}
    )
    .then(() => setActivo(true))
    .catch(() => { iniciandoRef.current = false; });

    return () => {
      iniciandoRef.current  = false;
      procesandoRef.current = false; // limpia el lock al desmontar
      setActivo(false);

      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [camaraId]);

  const cambiarCamara = async (nuevoCamaraId) => {
    if (!scannerRef.current) return;

    setActivo(false);
    iniciandoRef.current  = false;
    procesandoRef.current = false; // resetea lock al cambiar cámara

    try {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    } catch {}

    scannerRef.current = null;
    setCamaraId(nuevoCamaraId);
  };

  // El return es exactamente igual — no cambia nada visual
  return (
    <div
      className="min-h-screen p-8 flex flex-col items-center"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md mb-8 text-center"
      >
        <h2 className="text-2xl font-medium mb-1" style={{ color: '#e0f2fe' }}>
          Escanear QR
        </h2>
        <p className="text-sm" style={{ color: 'rgba(147,197,253,0.45)' }}>
          Acerca el código QR de la persona a la cámara
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(147,197,253,0.15)',
          backdropFilter: 'blur(24px)'
        }}
      >
        <div
          className="px-6 pt-5 pb-4 flex items-center justify-between"
          style={{ borderBottom: '0.5px solid rgba(147,197,253,0.08)' }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: escaneando ? [1, 0.3, 1] : 1 }}
              transition={{ duration: 1, repeat: escaneando ? Infinity : 0 }}
              className="w-2 h-2 rounded-full"
              style={{ background: escaneando ? '#facc15' : activo ? '#22c55e' : '#64748b' }}
            />
            <span className="text-xs font-medium" style={{ color: 'rgba(147,197,253,0.5)' }}>
              {escaneando ? 'Procesando...' : activo ? 'Cámara activa' : 'Iniciando...'}
            </span>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-lg font-mono"
            style={{
              background: 'rgba(99,102,241,0.1)',
              color: 'rgba(165,180,252,0.6)',
              border: '0.5px solid rgba(99,102,241,0.15)'
            }}
          >
            QR v3
          </span>
        </div>

        <div className="px-6 pt-6">
          <div
            id="qr-reader"
            className="rounded-2xl overflow-hidden w-full"
            style={{ minHeight: '280px' }}
          />
        </div>

        {camaras.length > 1 && (
          <div className="px-6 pt-4">
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(147,197,253,0.1)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="rgba(147,197,253,0.45)" strokeWidth="1.8"
                className="flex-shrink-0">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <span className="text-xs flex-shrink-0" style={{ color: 'rgba(147,197,253,0.4)' }}>
                Cámara
              </span>
              <div className="relative flex-1">
                <select
                  value={camaraId || ''}
                  onChange={e => cambiarCamara(e.target.value)}
                  className="w-full text-xs outline-none appearance-none cursor-pointer bg-transparent pr-6"
                  style={{ color: '#93c5fd' }}
                >
                  {camaras.map(cam => (
                    <option key={cam.id} value={cam.id}
                      style={{ background: '#0f172a', color: '#93c5fd' }}>
                      {cam.label || `Cámara ${cam.id.substring(0, 8)}`}
                    </option>
                  ))}
                </select>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(147,197,253,0.4)" strokeWidth="2.5"
                  className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {escaneando && (
              <motion.div
                key="escaneando"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: 'rgba(59,130,246,0.08)',
                  border: '0.5px solid rgba(59,130,246,0.2)'
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{ borderColor: 'rgba(59,130,246,0.3)', borderTopColor: '#3b82f6' }}
                />
                <span className="text-sm" style={{ color: '#93c5fd' }}>
                  Registrando asistencia...
                </span>
              </motion.div>
            )}

            {resultado && !escaneando && (
              <motion.div
                key="exito"
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: 'rgba(34,197,94,0.08)',
                  border: '0.5px solid rgba(34,197,94,0.2)'
                }}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="#22c55e" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#86efac' }}>
                    Asistencia registrada
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(134,239,172,0.6)' }}>
                    {resultado.persona?.nombre} {resultado.persona?.apellido}
                  </p>
                </div>
              </motion.div>
            )}

            {error && !escaneando && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '0.5px solid rgba(239,68,68,0.2)'
                }}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(239,68,68,0.12)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="#ef4444" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#fca5a5' }}>
                    No se pudo registrar
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(252,165,165,0.6)' }}>
                    {error}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 flex items-center gap-6"
      >
        {[
          { icon: '📱', text: 'Sostén el QR frente a la cámara' },
          { icon: '⚡', text: 'El registro es automático' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-base">{item.icon}</span>
            <span className="text-xs" style={{ color: 'rgba(147,197,253,0.35)' }}>
              {item.text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default QRScanner;