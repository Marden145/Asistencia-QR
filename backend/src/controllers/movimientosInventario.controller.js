const movimientosInventarioService = require('../services/movimientosInventario.service');

const movimientosInventarioController ={
    obtenerPorMesAño: async (req, res, next) => {
    try {
        const { mes, año } = req.query;
      const movimientos = await movimientosInventarioService.obtenerPorMesAño(Number(mes), Number(año));
      res.json(movimientos);
    } catch (err) { next(err); }
  }

};
module.exports = movimientosInventarioController; 