import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js';
import { FetchNearByGymsUseCase } from '../fetch-near-by-gyms.js';

export function makeFetchNearByGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearByGymsUseCase(gymsRepository);

  return useCase;
}
