import type { CheckIn } from '@/generated/prisma/client.js';
import type { CheckInsRepository } from '@/repositories/check-ins-repository.js';
import type { GymsRepository } from '@/repositories/gyms-repository.js';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.js';
import { MaxDistanceError } from './errors/max-distance-error.js';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    //100 meters
    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gymId: gymId,
    });

    return { checkIn };
  }
}
