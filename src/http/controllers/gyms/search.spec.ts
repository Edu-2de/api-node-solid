import { app } from '@/app.js';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authtenticate-user.js';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: null,
        phone: null,
        latitude: -30.1726591,
        longitude: -51.0654479,
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'TypeScript',
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'TypeScript Gym',
      }),
    ]);
  });
});
