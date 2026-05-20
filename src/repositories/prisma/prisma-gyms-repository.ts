import type { Gym } from '@/generated/prisma/client.js';
import type { GymCreateInput } from '@/generated/prisma/models.js';
import { prisma } from '@/lib/prisma.js';
import type {
  FindManyNearbyParams,
  GymsRepository,
} from '../gyms-repository.js';

export class PrismaGymsRepository implements GymsRepository {
  constructor() {}

  async create(data: GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return gym;
  }
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },

      take: 20,
      skip: (page - 1) * 20,
    });

    return gyms;
  }
  async findManyNearBy({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }
}
