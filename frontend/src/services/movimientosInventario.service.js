import api from './api';

const movimientosInventarioService = {
    historialMovimientos: async(mes,año)=>{
        const response = await api.get('/movimientos-inventario', {
        params: { mes, año }
      });
        return response.data;
    }
};
export default movimientosInventarioService;