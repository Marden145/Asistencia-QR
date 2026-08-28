const express = require('express');
const cors    = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

app.use(helmet());
app.use(compression());
const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 120,                  // máximo 120 requests por IP
  message: { error: 'Demasiadas peticiones, intenta más tarde' }
});

const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // solo 10 intentos de login cada 15 minutos
  message: { error: 'Demasiados intentos de login' }
});
const origenesPermitidos = [
  'http://localhost:5173',        // desarrollo
  'https://192.168.18.165',    // red local del centro
];


app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sin origin (Postman, móviles)
    if (!origin || origenesPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/api/', limiterGeneral);
app.use('/api/auth', limiterLogin, require('./routes/auth.routes'));
app.use('/api/personas', require('./routes/persona.routes'));
app.use('/api/asistencia', require('./routes/asistencia.routes'));
app.use('/api/sesion', require('./routes/sesion.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/pagos', require('./routes/pago.routes'));
app.use('/api/movimientos-inventario', require('./routes/movimientosInventario.routes'));
app.use('/api/persona-junta-directiva', require('./routes/personaJuntaDirectiva.routes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;