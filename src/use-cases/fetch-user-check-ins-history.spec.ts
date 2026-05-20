import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository copy.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history.js';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe('Fetch User Check-ins Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    });

    await checkInsRepository.create({
      gymId: 'gym-02',
      user_id: 'user-01',
    });

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-01' }),
      expect.objectContaining({ gymId: 'gym-02' }),
    ]);
  });

  it('Should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gymId: `gym-${i}`,
        user_id: 'user-01',
      });
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-21' }),
      expect.objectContaining({ gymId: 'gym-22' }),
    ]);
  });
});
