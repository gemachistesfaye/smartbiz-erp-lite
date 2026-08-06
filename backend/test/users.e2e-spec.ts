import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let ownerToken: string;
  let cashierToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const loginRes = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    ownerToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/users', () => {
    it('should create a new user (OWNER only)', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          email: 'cashier@example.com',
          password: 'password123',
          firstName: 'Cashier',
          lastName: 'User',
          role: 'CASHIER',
        })
        .expect(201)
        .expect(
          (res: {
            body: { success: boolean; data: { email: string; role: string; id: string } };
          }) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe('cashier@example.com');
            expect(res.body.data.role).toBe('CASHIER');
            userId = res.body.data.id;
          },
        );
    });

    it('should reject duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          email: 'cashier@example.com',
          password: 'password123',
          firstName: 'Another',
          lastName: 'User',
          role: 'CASHIER',
        })
        .expect(409);
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'new@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
          role: 'CASHIER',
        })
        .expect(401);
    });
  });

  describe('Role-Based Access Control', () => {
    beforeAll(async () => {
      const loginRes = await request(app.getHttpServer()).post('/api/auth/login').send({
        email: 'cashier@example.com',
        password: 'password123',
      });
      cashierToken = loginRes.body.data.accessToken;
    });

    it('CASHIER should NOT access GET /users (OWNER/MANAGER only)', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(403);
    });

    it('CASHIER should NOT access POST /users (OWNER only)', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${cashierToken}`)
        .send({
          email: 'another@example.com',
          password: 'password123',
          firstName: 'Another',
          lastName: 'User',
          role: 'CASHIER',
        })
        .expect(403);
    });

    it('CASHIER should NOT access PUT /users/:id/deactivate (OWNER only)', () => {
      return request(app.getHttpServer())
        .put(`/api/users/${userId}/deactivate`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(403);
    });

    it('CASHIER should NOT access DELETE /users/:id (OWNER only)', () => {
      return request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${cashierToken}`)
        .expect(403);
    });
  });

  describe('GET /api/users', () => {
    it('should return all users in business', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res: { body: { success: boolean; data: unknown[] } }) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThanOrEqual(2);
        });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by ID', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res: { body: { success: boolean; data: { id: string } } }) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(userId);
        });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', () => {
      return request(app.getHttpServer())
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          firstName: 'Updated',
          lastName: 'Cashier',
        })
        .expect(200)
        .expect((res: { body: { success: boolean; data: { firstName: string } } }) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.firstName).toBe('Updated');
        });
    });
  });

  describe('PUT /api/users/:id/deactivate', () => {
    it('should deactivate user', () => {
      return request(app.getHttpServer())
        .put(`/api/users/${userId}/deactivate`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res: { body: { success: boolean; data: { isActive: boolean } } }) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.isActive).toBe(false);
        });
    });
  });

  describe('PUT /api/users/:id/activate', () => {
    it('should activate user', () => {
      return request(app.getHttpServer())
        .put(`/api/users/${userId}/activate`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res: { body: { success: boolean; data: { isActive: boolean } } }) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.isActive).toBe(true);
        });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', () => {
      return request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res: { body: { success: boolean; data: { id: string } } }) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(userId);
        });
    });
  });
});
