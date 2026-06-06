// sesion.routes.js
const router          = require('express').Router();
const ctrl            = require('../controllers/sesion.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/estado',  ctrl.estado);
router.post('/abrir',  ctrl.abrir);
router.post('/cerrar', ctrl.cerrar);

module.exports = router;