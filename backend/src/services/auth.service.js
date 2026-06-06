const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');
const config         = require('../config');
const userRepository = require('../repositories/user.repository');

const authService = {

  login: async (email, password) => {

    // 1. ¿Existe el usuario?
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Credenciales inválidas');
      err.statusCode = 401;
      throw err;
    }

    // 2. ¿La contraseña es correcta?
    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      const err = new Error('Credenciales inválidas');
      err.statusCode = 401;
      throw err;
    }

    // 3. Generar token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '8h' }
    );

    // 4. Devolver token y datos básicos del usuario (nunca la contraseña)
    return {
      token,
      user: { id: user.id, email: user.email, role: user.role }
    };
  }

};

module.exports = authService;