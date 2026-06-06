const movimientosInventarioRepository = require('../repositories/movimientosInventario.repository');

const movimientosInventarioService = {
    obtenerPorMesAño: async (mes, año) => {
        return movimientosInventarioRepository.findByMesAño(mes, año);
    }
};
module.exports = movimientosInventarioService;