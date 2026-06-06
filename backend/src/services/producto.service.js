const productoRepository = require('../repositories/producto.repository');
const movimientosInventarioRepository = require('../repositories/movimientosInventario.repository');

const productoService={
    listar: async () => {
    return productoRepository.findAll();
  },
  obtener: async (id) => {
    const producto = await productoRepository.findById(id);
    // Regla de negocio: si no existe, lanzar error 404
    if (!producto) {
      const err = new Error('Producto no encontrado');
      err.statusCode = 404;
      throw err;
    }

    return producto;
  },
  crear: async (data) => {
    return productoRepository.create(data);
  },
  actualizar: async (id, data) => {
    await productoService.obtener(id);
    return productoRepository.update(id, data);
  },

  eliminar: async (id) => {
    // Verifica que existe antes de eliminar
    await productoService.obtener(id);
    return productoRepository.softDelete(id);
  },
  registrarIngreso: async (id,cantidad)=>{
        const producto = await productoService.obtener(id);
        const cantidadAnterior = producto.cantidad;
        const nuevaCantidad = producto.cantidad + cantidad;
        await productoRepository.recordRevenue(id, nuevaCantidad);
        return movimientosInventarioRepository.create({
            productoId: id,
            cantidad: cantidad,
            tipo: 'INGRESO',
            fecha: new Date(),
            stockAnterior: cantidadAnterior,
            stockNuevo: nuevaCantidad
        });
    },
    registrarEgreso: async (id,cantidad)=>{
        const producto = await productoService.obtener(id);
        const cantidadAnterior = producto.cantidad;
        const nuevaCantidad = producto.cantidad - cantidad;
        await productoRepository.recordExpenses(id, nuevaCantidad);
        return movimientosInventarioRepository.create({
            productoId: id,
            cantidad: cantidad,
            tipo: 'EGRESO',
            fecha: new Date(),
            stockAnterior: cantidadAnterior,
            stockNuevo: nuevaCantidad
        });
    }
};
module.exports = productoService;