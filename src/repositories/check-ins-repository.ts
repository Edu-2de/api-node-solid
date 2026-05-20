import type { CheckIn } from '@/generated/prisma/client.js';
import type { CheckInUncheckedCreateInput } from '@/generated/prisma/models.js';

export interface CheckInsRepository {
  create(data: CheckInUncheckedCreateInput): Promise<CheckIn>;
  save(checkIn: CheckIn): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  countByUserId(userId: string): Promise<number>;
  findById(id: string): Promise<CheckIn | null>;
}
