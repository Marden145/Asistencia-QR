const request = require('supertest');
const app = require('../app');

beforeAll(async () => {

  await prisma.user.create({
            data: {
                email: 'admin@test.com',
                password: 'password123',
                role: 'ADMIN'
            }
        });
});


describe('POST /api/auth/login', () => {
    test('login exitoso con credenciales validas',async()=>{
        const res=await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).not.toHaveProperty('password');
    });


    test('rechaza credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
    });

    test('rechaza email inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@test.com', password: '123' });

    expect(res.statusCode).toBe(401);
  });

  test('rechaza body vacío', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.statusCode).toBe(400);
  });
});




