import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchNearByGymsUseCase } from './fetch-near-by-gyms.js';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearByGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearByGymsUseCase(gymsRepository);
  });

  it('Should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near gym',
      description: null,
      phone: null,
      latitude: -30.1726591,
      longitude: -51.0654479,
    });

    await gymsRepository.create({
      title: 'Far gym',
      description: null,
      phone: null,
      latitude: -30.3022524,
      longitude: -50.4343605,
    });

    const { gyms } = await sut.execute({
      userLatitude: -30.1726591,
      userLongitude: -51.0654479,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near gym' })]);
  });
});
