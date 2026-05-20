import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository copy.js';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { Decimal } from '@prisma/client/runtime/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckInUseCase } from './check-in.js';
import { MaxDistanceError } from './errors/max-distance-error.js';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.js';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -30.1726591,
      longitude: -51.0654479,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -30.1726591,
      userLongitude: -51.0654479,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('Should not to be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -30.1726591,
      userLongitude: -51.0654479,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -30.1726591,
        userLongitude: -51.0654479,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('Should to be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -30.1726591,
      userLongitude: -51.0654479,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -30.1726591,
      userLongitude: -51.0654479,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('Should not to be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-30.1726591),
      longitude: new Decimal(-51.0654479),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -30.031872,
        userLongitude: -51.2065536,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
