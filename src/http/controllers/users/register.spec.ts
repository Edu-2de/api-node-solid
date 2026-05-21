import { app } from '@/app.js';
import { prisma } from '@/lib/prisma.js';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    expect(response.statusCode).toEqual(201);
  });
});
