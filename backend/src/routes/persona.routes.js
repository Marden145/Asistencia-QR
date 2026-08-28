const router         = require('express').Router();
const ctrl           = require('../controllers/persona.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// verifyToken se aplica a todas las rutas de este archivo
router.use(verifyToken);

router.get('/',      ctrl.listar);
router.get('/:id',   ctrl.obtener);
router.post('/',     ctrl.crear);
router.put('/:id',   ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);


module.exports = router;