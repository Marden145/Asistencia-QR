import { useState }     from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useProductos      from '../hooks/useProductos';
import ProductosTable     from '../components/Productos/ProductosTable';
import ProductoForm      from '../components/Productos/ProductoForm';
import MovimientoForm              from '../components/Productos/MovimientosForm'; 
import HistorialMovimientos from '../components/movimientosInventario/HistorialMovimientos';
import { useToastContext } from '../context/ToastContext';
const Inventario = () =>{
    const { productos, loading, error, crear, actualizar, eliminar, cargar, registrarEgresos, registrarIngresos } = useProductos();
    const [productoEditando, setProductoEditando] = useState(null);
    const [mostrarModal,    setMostrarModal]    = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [tipoMovimiento,      setTipoMovimiento]      = useState(null); // 'ingreso' | 'egreso' | null
    const [mostrarMovimiento,   setMostrarMovimiento]   = useState(false);
    const [vistaActiva, setVistaActiva] = useState('productos');

    const toast = useToastContext();


  const productosFiltrados = productos.filter(p => {
  const texto = busqueda.toLowerCase();
  return (
    p.nombre.toLowerCase().includes(texto)   ||
    p.descripcion?.toLowerCase().includes(texto)   ||
    p.precio.toString().includes(texto)   
  );
});


    const handleCrear = () => {
    setProductoEditando(null); // sin datos = modo crear
    setMostrarModal(true);
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto); // con datos = modo editar
    setMostrarModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await eliminar(id);
      toast.exito('Producto eliminado', `El producto ha sido eliminado correctamente.`);
    } catch {
      toast.error('Error al eliminar producto', 'No se pudo eliminar el producto.');
    }
  };
  const handleSubmitForm = async (data) => {
    try {
      if (productoEditando) {
        await actualizar(productoEditando.id, data);
        toast.exito('Producto actualizado', `El producto "${data.nombre}" ha sido actualizado correctamente.`);
      } else {
        await crear(data);
        toast.exito('Producto creado', `El producto "${data.nombre}" ha sido creado correctamente.`);
      }
      setMostrarModal(false);
    } catch {
      toast.error('Error al guardar producto', 'No se pudo guardar el producto.');
    }
  };
  const handleCancelar = () => {
    setMostrarModal(false);
    setProductoEditando(null);
  };
  const handleAbrirIngreso = () => {
    setTipoMovimiento('ingreso');
    setMostrarMovimiento(true);
  };

  const handleAbrirEgreso = () => {
    setTipoMovimiento('egreso');
    setMostrarMovimiento(true);
  };

  const handleCancelarMovimiento = () => {
    setMostrarMovimiento(false);
    setTipoMovimiento(null);
  };

  const handleSubmitMovimiento = async (data) => {
    try {
      if (tipoMovimiento === 'ingreso') {
        await registrarIngresos(data.productoId, data.cantidad);
        toast.exito('Movimiento registrado', `El ingreso de producto ha sido registrado correctamente.`);
      } else {
        await registrarEgresos(data.productoId, data.cantidad);
        toast.exito('Movimiento registrado', `El egreso de producto ha sido registrado correctamente.`);
      }
      setMostrarMovimiento(false);
      setTipoMovimiento(null);
    } catch (err) {
      toast.error('Error al registrar movimiento', err.response?.data?.error || 'No se pudo registrar el movimiento.');
    }
  };





  if (loading) return <p style={{ padding: '2rem' }}>Cargando productos...</p>;
  if (error)   return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div className="min-h-screen p-8"
    style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
      {/* Header con Título y Navegación de Pestañas */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-medium" style={{ color: '#e0f2fe' }}>
            Módulo de Inventario
          </h2>
        </div>

        {/* 👇 Controles de Pestañas (Tabs) */}
        <div className="flex items-center gap-2 border-b" style={{ borderColor: 'rgba(147,197,253,0.1)' }}>
          <button
            onClick={() => setVistaActiva('productos')}
            className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
              vistaActiva === 'productos' 
                ? 'text-blue-400 border-blue-400' 
                : 'text-slate-400 border-transparent hover:text-slate-300'
            }`}
          >
            Stock Actual
          </button>
          <button
            onClick={() => setVistaActiva('historial')}
            className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
              vistaActiva === 'historial' 
                ? 'text-blue-400 border-blue-400' 
                : 'text-slate-400 border-transparent hover:text-slate-300'
            }`}
          >
            Historial de Movimientos
          </button>
        </div>
      </div>


      {/* 👇 Renderizado Condicional de las Vistas */}
      <AnimatePresence mode="wait">
        {vistaActiva === 'productos' ? (
          <motion.div 
            key="vista-productos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
<div className="flex items-center justify-between mb-8">
  <div>
    <h2 className="text-2xl font-medium" style={{ color: '#e0f2fe' }}>
      Productos
    </h2>
    <p className="text-xs mt-1" style={{ color: 'rgba(147,197,253,0.4)' }}>
      {productos.length} de {productos.length} registros
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
      placeholder="Buscar por nombre"
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

  {/* Botones de acción */}
        <div className="flex items-center gap-2">

          {/* Egreso — rojo */}
          <motion.button
            whileHover={{ y: -2, opacity: 0.9 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAbrirEgreso}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-none cursor-pointer"
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#fca5a5',
              border: '0.5px solid rgba(239,68,68,0.2)'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="19" x2="12" y2="5"/>
              <polyline points="5 12 12 5 19 12"/>
            </svg>
            Egreso
          </motion.button>

          {/* Ingreso — verde */}
          <motion.button
            whileHover={{ y: -2, opacity: 0.9 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAbrirIngreso}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-none cursor-pointer"
            style={{
              background: 'rgba(34,197,94,0.1)',
              color: '#86efac',
              border: '0.5px solid rgba(34,197,94,0.2)'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <polyline points="19 12 12 19 5 12"/>
            </svg>
            Ingreso
          </motion.button>

          {/* Nuevo producto — azul */}
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
            Nuevo producto
          </motion.button>
        </div>
</div>

            <ProductosTable
              productos={productosFiltrados}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="vista-historial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <HistorialMovimientos />
          </motion.div>
        )}
      </AnimatePresence>



     
<AnimatePresence>
      {mostrarModal && (
        <ProductoForm
          producto={productoEditando}
          onSubmit={handleSubmitForm}
          onCancelar={handleCancelar}
        />
      )}
  </AnimatePresence>

  {/* Modal movimiento — mismo componente, diferente tipo */}
      <AnimatePresence>
        {mostrarMovimiento && (
          <MovimientoForm
            tipo={tipoMovimiento}
            productos={productos}
            onSubmit={handleSubmitMovimiento}
            onCancelar={handleCancelarMovimiento}
          />
        )}
      </AnimatePresence>

    </div>
  );


};
export default Inventario;