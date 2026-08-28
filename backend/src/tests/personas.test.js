const request = require('supertest');
const app = require('../src/app');
let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' });
  token = res.body.token;
});

describe('GET /api/personas', () => {
    test('retorna lista de personas autenticado', async () => {
    const res = await request(app)
      .get('/api/personas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('rechaza sin token', async () => {
    const res = await request(app).get('/api/personas');
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/personas', () => {
    test('crea persona con datos válidos', async () => {
    const res = await request(app)
      .post('/api/personas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre:          'Test',
        apellido:        'Usuario Prueba',
        fechaNacimiento: '1950-01-01'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('codigoQR'); // QR generado automáticamente
    expect(res.body.nombre).toBe('Test');
  });

  test('rechaza persona sin nombre', async () => {
    const res = await request(app)
      .post('/api/personas')
      .set('Authorization', `Bearer ${token}`)
      .send({ apellido: 'Sin Nombre' });

    expect(res.statusCode).toBe(400);
  });


  test('el QR generado es único', async () => {
    const res1 = await request(app)
      .post('/api/personas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Persona', apellido: 'Uno', fechaNacimiento: '1950-01-01' });

    const res2 = await request(app)
      .post('/api/personas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Persona', apellido: 'Dos', fechaNacimiento: '1950-01-01' });

    expect(res1.body.codigoQR).not.toBe(res2.body.codigoQR);
  });

});

describe('PUT /api/personas/:id', () => {

  test('actualiza persona existente', async () => {
    // Primero crea una persona
    const crear = await request(app)
      .post('/api/personas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Original', apellido: 'Apellido', fechaNacimiento: '1950-01-01' });

    const res = await request(app)
      .put(`/api/personas/${crear.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Actualizado', apellido: 'Apellido', fechaNacimiento: '1950-01-01' });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Actualizado');
  });

  test('retorna 404 para persona inexistente', async () => {
    const res = await request(app)
      .put('/api/personas/id-que-no-existe')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Test', apellido: 'Test' });

    expect(res.statusCode).toBe(404);
  });
});