import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new business owner', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          businessName: 'Test Business',
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(201)
        .expect(
          (res: {
            body: {
              success: boolean;
              data: {
                user: { email: string; role: string };
                accessToken: string;
                refreshToken: string;
              };
            };
          }) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.user).toBeDefined();
            expect(res.body.data.user.email).toBe('test@example.com');
            expect(res.body.data.user.role).toBe('OWNER');
            expect(res.body.data.accessToken).toBeDefined();
            expect(res.body.data.refreshToken).toBeDefined();
          },
        );
    });

    it('should reject duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          businessName: 'Another Business',
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Another',
          lastName: 'User',
        })
        .expect(409);
    });

    it('should reject invalid email format', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          businessName: 'Test Business',
          email: 'invalid-email',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);
    });

    it('should reject short password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          businessName: 'Test Business',
          email: 'test2@example.com',
          password: '123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect(
          (res: {
            body: {
              success: boolean;
              data: { user: { email: string }; accessToken: string; refreshToken: string };
            };
          }) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.user).toBeDefined();
            expect(res.body.data.user.email).toBe('test@example.com');
            expect(res.body.data.accessToken).toBeDefined();
            expect(res.body.data.refreshToken).toBeDefined();
          },
        );
    });

    it('should reject invalid password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should reject non-existent email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer()).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      refreshToken = res.body.data.refreshToken;
    });

    it('should refresh tokens', () => {
      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200)
        .expect(
          (res: {
            body: { success: boolean; data: { accessToken: string; refreshToken: string } };
          }) => {
            expect(res.body.success).toBe(true);
            expect(res.body.data.accessToken).toBeDefined();
            expect(res.body.data.refreshToken).toBeDefined();
          },
        );
    });

    it('should reject invalid refresh token', () => {
      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer()).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      accessToken = res.body.data.accessToken;
    });

    it('should return current user', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: { body: { success: boolean; data: { email: string } } }) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.email).toBe('test@example.com');
        });
    });

    it('should reject unauthenticated request', () => {
      return request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });
  });
});
