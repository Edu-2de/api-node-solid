import { app } from '@/app.js';
import { prisma } from '@/lib/prisma.js';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'jhondoe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
