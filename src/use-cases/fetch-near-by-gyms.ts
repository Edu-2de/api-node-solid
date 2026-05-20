import type { Gym } from '@/generated/prisma/client.js';
import type { GymsRepository } from '@/repositories/gyms-repository.js';

interface FetchNearByGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}
interface FetchNearByGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearByGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearByGymsUseCaseRequest): Promise<FetchNearByGymsUseCaseResponse> {
    const gyms = await this.gymRepository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
