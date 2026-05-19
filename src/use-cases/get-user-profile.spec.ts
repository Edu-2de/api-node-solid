import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { GetUserProfileUseCase } from "./get-user-profilet.js";

let userRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(userRepository);
    });

    it("Should be able to get user profile", async () => {
        const createdUser = await userRepository.create({
            name: "John Doe",
            email: "johndoe@email.com",
            password_hash: await hash("123456", 6),
        });

        const { user } = await sut.execute({ userid: createdUser.id });

        expect(user.id).toEqual(expect.any(String));
        expect(user.name).toEqual("John Doe");
    });

    it("Should not be able to get a profile whit wrong id", async () => {
        await expect(() =>
            sut.execute({
                userid: "not-exists-id",
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
