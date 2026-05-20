import type { Gym } from '@/generated/prisma/client.js';
import type { GymCreateInput } from '@/generated/prisma/models.js';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js';
import { Decimal } from '@prisma/client/runtime/client';
import { randomUUID } from 'node:crypto';
import type {
  FindManyNearbyParams,
  GymsRepository,
} from '../gyms-repository.js';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async create(data: GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.items.push(gym);

    return gym;
  }

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id);
    if (!gym) {
      return null;
    }
    return gym;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearBy(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      );

      return distance < 10;
    });
  }
}
