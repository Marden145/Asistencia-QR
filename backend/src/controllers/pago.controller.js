const pagoService = require('../services/pago.service');

const pagoController = {

  guardar: async (req, res, next) => {
    try {
      const { personaId, mes, año, semana1, semana2, semana3, semana4,semana1MetodoPago, semana2MetodoPago, semana3MetodoPago, semana4MetodoPago, notas,recibo } = req.body;

      if (!personaId || !mes || !año) {
        return res.status(400).json({ error: 'personaId, mes y año son requeridos' });
      }

      const pago = await pagoService.guardar(
        personaId, Number(mes), Number(año),
        { semana1, semana2, semana3, semana4, semana1MetodoPago, semana2MetodoPago, semana3MetodoPago, semana4MetodoPago, notas, recibo }
      );

      res.status(200).json(pago);
    } catch (err) { next(err); }
  },

  obtenerPorMes: async (req, res, next) => {
    try {
      const { personaId } = req.params;
      const { mes, año }  = req.query;

      const pago = await pagoService.obtenerPorMes(
        personaId, Number(mes), Number(año)
      );
      res.json(pago);
    } catch (err) { next(err); }
  },

  historial: async (req, res, next) => {
    try {
      const pagos = await pagoService.historial(req.params.personaId);
      res.json(pagos);
    } catch (err) { next(err); }
  },

  reporteMensual: async (req, res, next) => {
    try {
      const { mes, año } = req.query;
      const pagos = await pagoService.reporteMensual(Number(mes), Number(año));
      res.json(pagos);
    } catch (err) { next(err); }
  },
  obtenerResumenDashboard: async (req, res, next) => {
    try {
      const { mes, año } = req.query;
      const resumen = await pagoService.obtenerResumenDashboard(Number(mes), Number(año));
      res.json(resumen);
    } catch (err) { next(err); }
  }
};

module.exports = pagoController;