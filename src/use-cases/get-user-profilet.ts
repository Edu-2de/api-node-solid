import type { User } from "@/generated/prisma/client.js";
import type { UsersRepository } from "@/repositories/users-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface GetUserProfileUseCaseRequest {
    userid: string;
}

interface GetUserProfileUseCaseResponse {
    user: User;
}

export class GetUserProfileUseCase {
    constructor(private userRepository: UsersRepository) {}

    async execute({
        userid,
    }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
        const user = await this.userRepository.findById(userid);
        if (!user) {
            throw new ResourceNotFoundError();
        }

        return {
            user,
        };
    }
}
