const router          = require('express').Router();
const ctrl            = require('../controllers/movimientosInventario.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', ctrl.obtenerPorMesAño);

module.exports = router;