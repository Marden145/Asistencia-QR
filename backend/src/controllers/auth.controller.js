const authService = require('../services/auth.service');

const authController = {

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const resultado = await authService.login(email, password);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  }

};
module.exports = authController;