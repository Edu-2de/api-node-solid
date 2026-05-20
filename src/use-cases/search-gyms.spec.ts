import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchGymsUseCase } from './search-gyms.js';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript gym',
      description: null,
      phone: null,
      latitude: -30.1726591,
      longitude: -51.0654479,
    });

    const { gyms } = await sut.execute({
      query: 'gym',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript gym' }),
    ]);
  });

  it('Should be able to fetch paginated search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `gym ${i}`,
        description: null,
        phone: null,
        latitude: -30.1726591,
        longitude: -51.0654479,
      });
    }

    const { gyms } = await sut.execute({
      query: 'gym',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym 21' }),
      expect.objectContaining({ title: 'gym 22' }),
    ]);
  });
});
