const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/personas', require('./routes/persona.routes'));
app.use('/api/asistencia', require('./routes/asistencia.routes'));
app.use('/api/sesion', require('./routes/sesion.routes'));
app.use('/api/productos', require('./routes/producto.routes'));
app.use('/api/pagos', require('./routes/pago.routes'));
app.use('/api/movimientos-inventario', require('./routes/movimientosInventario.routes'));
app.use('/api/persona-junta-directiva', require('./routes/personaJuntaDirectiva.routes'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'Servidor funcionando' });
});

module.exports = app;