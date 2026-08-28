// tests/asistencia.test.js
const request = require('supertest');
const app     = require('../src/app');

let token;
let personaId;
let codigoQR;

beforeAll(async () => {
  // Login
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' });
  token = loginRes.body.token;

  // Crea persona de prueba
  const personaRes = await request(app)
    .post('/api/personas')
    .set('Authorization', `Bearer ${token}`)
    .send({ nombre: 'Test', apellido: 'Asistencia', fechaNacimiento: '1950-01-01' });

  personaId = personaRes.body.id;
  codigoQR  = personaRes.body.codigoQR;
});

describe('Sesión de asistencia', () => {

  test('abre una sesión del día', async () => {
    const res = await request(app)
      .post('/api/sesion/abrir')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.abierta).toBe(true);
  });

  test('no permite abrir dos sesiones el mismo día', async () => {
    const res = await request(app)
      .post('/api/sesion/abrir')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(409); // Conflict
  });
});

describe('Registro de asistencia por QR', () => {

  test('registra presente con QR válido', async () => {
    const res = await request(app)
      .post('/api/asistencia/registrar-qr')
      .set('Authorization', `Bearer ${token}`)
      .send({ codigoQR });

    expect(res.statusCode).toBe(201);
    expect(res.body.asistencia.estado).toBe('PRESENTE');
    expect(res.body.persona.id).toBe(personaId);
  });

  test('no permite registrar la misma persona dos veces el mismo día', async () => {
    const res = await request(app)
      .post('/api/asistencia/registrar-qr')
      .set('Authorization', `Bearer ${token}`)
      .send({ codigoQR });

    expect(res.statusCode).toBe(409); // Conflict — restricción única
  });

  test('rechaza QR inexistente', async () => {
    const res = await request(app)
      .post('/api/asistencia/registrar-qr')
      .set('Authorization', `Bearer ${token}`)
      .send({ codigoQR: 'qr-que-no-existe-en-la-bd' });

    expect(res.statusCode).toBe(404);
  });
});

describe('Cierre de sesión', () => {

  test('cierra la sesión y genera ausentes', async () => {
    const res = await request(app)
      .post('/api/sesion/cerrar')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalPresentes');
    expect(res.body).toHaveProperty('totalAusentes');
    expect(typeof res.body.totalPresentes).toBe('number');
  });
});