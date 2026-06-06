const router          = require('express').Router();
const ctrl            = require('../controllers/pago.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.post('/',                           ctrl.guardar);
router.get('/reporte',                     ctrl.reporteMensual);
router.get('/:personaId/mes',              ctrl.obtenerPorMes);
router.get('/:personaId/historial',        ctrl.historial);

module.exports = router;