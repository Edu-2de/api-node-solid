import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";
import { UserAlreadyExists } from "./errors/user-already-exists.js";
import { RegisterUseCase } from "./register.js";

describe("Register Use Case", () => {
    it("Should be able to register", async () => {
        const userRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(userRepository);

        const { user } = await registerUseCase.execute({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456",
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("Should hash user password upon registration", async () => {
        const registerUseCase = new RegisterUseCase({
            async create(data) {
                return {
                    id: "user-1",
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date(),
                };
            },
            async findByEmail(email) {
                return null;
            },
        });

        const { user } = await registerUseCase.execute({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456",
        });

        const isPasswordCorrectlyHashed = await compare(
            "123456",
            user.password_hash,
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it("Should not be able to register with same email twice", async () => {
        const userRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(userRepository);

        const email = "johndoe@example.com";

        await registerUseCase.execute({
            name: "John Doe",
            email,
            password: "123456",
        });

        expect(() =>
            registerUseCase.execute({
                name: "John Doe",
                email,
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExists);
    });
});
