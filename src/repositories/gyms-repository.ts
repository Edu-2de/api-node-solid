import type { Gym } from '@/generated/prisma/client.js';
import type { GymCreateInput } from '@/generated/prisma/models.js';

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface GymsRepository {
  create(data: GymCreateInput): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  findManyNearBy(params: FindManyNearbyParams): Promise<Gym[]>;
}
