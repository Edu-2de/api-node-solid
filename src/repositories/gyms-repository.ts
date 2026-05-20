import type { Gym } from '@/generated/prisma/client.js';
import type { GymCreateInput } from '@/generated/prisma/models.js';

export interface GymsRepository {
  create(data: GymCreateInput): Promise<Gym>;
  findById(id: string): Promise<Gym | null>;
  searchMany(query: string, page: number): Promise<Gym[]>;
}
