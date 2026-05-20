import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository copy.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserMetricsUseCase } from './get-user-metrics.js';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('it should be able to check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    });
    await checkInsRepository.create({
      gymId: 'gym-02',
      user_id: 'user-01',
    });

    const { checkInsCount } = await sut.execute({ userId: 'user-01' });

    expect(checkInsCount).toEqual(2);
  });
});
