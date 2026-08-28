import { useState }     from 'react';
import usePersonas      from '../hooks/usePersonas';
import PersonaTable     from '../components/Personas/PersonaTable';
import PersonaForm      from '../components/Personas/PersonaForm';
import QRDisplay from '../components/QR/QRDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import PagoModal from '../components/Personas/PagoModal';
import { useToastContext } from '../context/ToastContext';
import pagoService from '../services/pago.service';
import { generarPdfReporteMensual } from '../utils/pdfGenerator';
import  useConfirm  from '../hooks/useConfirm';
import ConfirmModal from '../components/ConfirmModal';


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
  const [descargandoPDF, setdescargandoPDF] = useState(false);
  const toast = useToastContext();
  const { isOpen, confirmData, abrirConfirmacion, cerrarConfirmacion } = useConfirm();

  const personasFiltradas = personas.filter(p => {
  const texto = busqueda.toLowerCase();
  return (
    p.nombre.toLowerCase().includes(texto)   ||
    p.apellido.toLowerCase().includes(texto) ||
    p.email?.toLowerCase().includes(texto)   ||
    p.telefono?.includes(texto)
  );
});

const handleDescargarReporte = async () => {
    try {
      setdescargandoPDF(true);
      // 🌟 Obtener mes (1-12) y año actuales del sistema de manera dinámica
      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth() + 1; 
      const anioActual = fechaActual.getFullYear();

      // Llamada al endpoint estructurado con params
      const data = await pagoService.reporteMensual(mesActual, anioActual);

      if (!data || data.length === 0) {
        toast.error('Error','No se encontraron registros de pagos para el mes en curso.');
        return;
      }

      // Invocar la utilidad para procesar y descargar el documento
      generarPdfReporteMensual(data, mesActual, anioActual);

    } catch (error) {
      toast.error('Error','Hubo un problema al generar el archivo PDF.');
    } finally {
      setdescargandoPDF(false);
    }
  };
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
    try {
      await eliminar(id);
      toast.exito('Persona eliminada','La persona ha sido eliminada exitosamente.');
    } catch {
      toast.error('Error','Error al eliminar la persona.');
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (personaEditando) {
        await actualizar(personaEditando.id, data);
        toast.exito('Persona actualizada','La persona ha sido actualizada exitosamente.');
      } else {
        await crear(data);
        toast.exito('Persona creada','La persona ha sido creada exitosamente.');
      }
      setMostrarModal(false);
    } catch {
      toast.error('Error','Error al guardar la persona.');
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

  {/* Contenedor de Botones de Acción */}
  <div className="flex items-center gap-3">
    
    {/* Botón Descargar PDF (Nuevo) */}
    <motion.button
      whileHover={{ y: -2, background: 'rgba(255,255,255,0.08)' }}
      whileTap={{ scale: 0.97 }}
      onClick={handleDescargarReporte}
      disabled={descargandoPDF} // Estado opcional si manejas el loading en la página
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border cursor-pointer transition-colors"
      style={{ 
        background: 'rgba(255,255,255,0.04)', 
        borderColor: 'rgba(147,197,253,0.2)',
        color: '#bae6fd' // Un azul/celeste claro elegante
      }}
    >
      {descargandoPDF ? (
        <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-sky-300 border-t-transparent rounded-full" />
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
      {descargandoPDF ? 'Generando...' : 'Reporte Mensual'}
    </motion.button>

    {/* Botón Nueva Persona */}
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
</div>

      <PersonaTable
        personas={personasFiltradas}
        onEditar={handleEditar}
        onEliminar={abrirConfirmacion}
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
<ConfirmModal
        isOpen={isOpen}
        onClose={cerrarConfirmacion}
        onConfirm={() => handleEliminar(confirmData.id)} // Pasa el ID guardado
        titulo="¿Eliminar persona definitivamente?"
        mensaje={`¿Estás seguro de que deseas eliminar a ${confirmData?.nombre} ${confirmData?.apellido}? Esta acción no se puede deshacer y borrará su registro.`}
        botonConfirmarText="Eliminar permanentemente"
        botonConfirmarText="Eliminar Cuenta"
        tipo="error" // 'error' pinta el botón rojo, 'alerta' lo pinta amarillo
      />

    </div>
  );
};

export default Personas;