const router          = require('express').Router();
const ctrl            = require('../controllers/asistencia.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.post('/registrar', ctrl.registrarPorQR);
router.get('/reporte',    ctrl.reporteSemanal);
router.get('/metricas', ctrl.metricas);
router.get('/tabla', ctrl.tablaAsistencia);
module.exports = router;