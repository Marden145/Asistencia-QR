const productoService = require('../services/producto.service');

const productoController = {
    listar: async (req, res, next) => {
    try {
      const productos = await productoService.listar();
      res.json(productos);
    } catch (err) {
      next(err);
    }
  },
  obtener: async (req, res, next) => {
    try {
      // req.params.id es el :id de la URL → GET /personas/123
      const producto = await productoService.obtener(req.params.id);
      res.json(producto);
    } catch (err) {
      next(err);
    }
  },
  crear: async (req, res, next) => {
    try {
      const { nombre, descripcion, precio, cantidad } = req.body;
      const producto = await productoService.crear({ nombre, descripcion, precio: parseFloat(precio), cantidad: parseInt(cantidad, 10) });
      res.status(201).json(producto);
    } catch (err) {
      next(err);
    }
  },
  actualizar: async (req, res, next) => {
    try {
      const { nombre, descripcion, precio, cantidad } = req.body;
      const producto = await productoService.actualizar(req.params.id, { nombre, descripcion, precio: parseFloat(precio), cantidad: parseInt(cantidad, 10) });
      res.json(producto);
    } catch (err) {
      next(err);
    }
  },
  eliminar: async (req, res, next) => {
    try {
      await productoService.eliminar(req.params.id);
      res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  },
  registrarIngreso: async (req, res, next) => 
    {
        try{
            const producto = await productoService.registrarIngreso(req.params.id, parseInt(req.body.cantidad, 10));
            res.json(producto);

        }catch(err){
        
            next(err);
        }
    },
    registrarEgreso: async (req, res, next) => 
    {
        try{
            const producto = await productoService.registrarEgreso(req.params.id, parseInt(req.body.cantidad, 10));
            res.json(producto);

        }catch(err){
        
            next(err);
        }
    }
};
module.exports = productoController;