import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js';
import { GetUserProfileUseCase } from '../get-user-profilet.js';

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(usersRepository);

  return useCase;
}
