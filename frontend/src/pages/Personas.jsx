import { useState }     from 'react';
import usePersonas      from '../hooks/usePersonas';
import PersonaTable     from '../components/Personas/PersonaTable';
import PersonaForm      from '../components/Personas/PersonaForm';
import QRDisplay from '../components/QR/QRDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import PagoModal from '../components/Personas/PagoModal';
const Personas = () => {

  const { personas, loading, error, crear, actualizar, eliminar } = usePersonas();

  // null = modal cerrado
  // false = modal abierto para crear (sin datos)
  // { id, nombre, ... } = modal abierto para editar (con datos)
  const [personaEditando, setPersonaEditando] = useState(null);
  const [mostrarModal,    setMostrarModal]    = useState(false);
  const [personaQR, setPersonaQR] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [personaPago, setPersonaPago] = useState(null);

  const personasFiltradas = personas.filter(p => {
  const texto = busqueda.toLowerCase();
  return (
    p.nombre.toLowerCase().includes(texto)   ||
    p.apellido.toLowerCase().includes(texto) ||
    p.email?.toLowerCase().includes(texto)   ||
    p.telefono?.includes(texto)
  );
});
// Agrega este handler
const handleVerQR = (persona) => {
  setPersonaQR(persona);
};
const handleVerPagos = (persona) => setPersonaPago(persona);

  const handleCrear = () => {
    setPersonaEditando(null); // sin datos = modo crear
    setMostrarModal(true);
  };

  const handleEditar = (persona) => {
    setPersonaEditando(persona); // con datos = modo editar
    setMostrarModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta persona?')) return;
    try {
      await eliminar(id);
    } catch {
      alert('Error al eliminar');
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (personaEditando) {
        await actualizar(personaEditando.id, data);
      } else {
        await crear(data);
      }
      setMostrarModal(false);
    } catch {
      alert('Error al guardar');
    }
  };

  const handleCancelar = () => {
    setMostrarModal(false);
    setPersonaEditando(null);
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando personas...</p>;
  if (error)   return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div className="min-h-screen p-8"
    style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

      {/* Header */}
<div className="flex items-center justify-between mb-8">
  <div>
    <h2 className="text-2xl font-medium" style={{ color: '#e0f2fe' }}>
      Personas
    </h2>
    <p className="text-xs mt-1" style={{ color: 'rgba(147,197,253,0.4)' }}>
      {personasFiltradas.length} de {personas.length} registros
    </p>
  </div>

  {/* Barra de búsqueda */}
  <div className="relative flex-1 max-w-xs mx-6">
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2"
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="rgba(147,197,253,0.4)" strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>

    <input
      type="text"
      placeholder="Buscar por nombre, email..."
      value={busqueda}
      onChange={e => setBusqueda(e.target.value)}
      className="w-full text-sm outline-none pl-9 pr-4 py-2.5 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(147,197,253,0.15)',
        color: '#e0f2fe',
      }}
    />

    {/* Botón para limpiar búsqueda */}
    {busqueda && (
      <button
        onClick={() => setBusqueda('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer"
        style={{ color: 'rgba(147,197,253,0.4)' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    )}
  </div>

  <motion.button
    whileHover={{ y: -2, opacity: 0.92 }}
    whileTap={{ scale: 0.97 }}
    onClick={handleCrear}
    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white border-none cursor-pointer"
    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    Nueva persona
  </motion.button>
</div>

      <PersonaTable
        personas={personasFiltradas}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        onVerQR={handleVerQR}
        onVerPagos={handleVerPagos}
      />
      <AnimatePresence>
      {personaQR && (
  <QRDisplay
    persona={personaQR}
    onCerrar={() => setPersonaQR(null)}
  />
)}
</AnimatePresence>
<AnimatePresence>
      {mostrarModal && (
        <PersonaForm
          persona={personaEditando}
          onSubmit={handleSubmitForm}
          onCancelar={handleCancelar}
        />
      )}
  </AnimatePresence>
  <AnimatePresence>
  {personaPago && (
    <PagoModal
      persona={personaPago}
      onCerrar={() => setPersonaPago(null)}
    />
  )}
</AnimatePresence>

    </div>
  );
};

export default Personas;