import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymUseCase } from './create-gym.js';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('Should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript gym',
      description: null,
      phone: null,
      latitude: -30.1726591,
      longitude: -51.0654479,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
