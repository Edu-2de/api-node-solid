import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js";

let userRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(userRepository);
    });

    it("Should be able to authenticate", async () => {
        await userRepository.create({
            name: "John Doe",
            email: "johndoe@email.com",
            password_hash: await hash("123456", 6),
        });

        const { user } = await sut.execute({
            email: "johndoe@email.com",
            password: "123456",
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("Should not be able to authenticate with wrong e-mail", async () => {
        await expect(() =>
            sut.execute({
                email: "fulano@gmail.com",
                password: "fulano123",
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it("Should not be able to authenticate with wrong password", async () => {
        await userRepository.create({
            name: "John Doe",
            email: "johndoe@email.com",
            password_hash: await hash("123456", 6),
        });

        await expect(() =>
            sut.execute({
                email: "johndoe@email.com",
                password: "123123",
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
