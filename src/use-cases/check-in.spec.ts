import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository copy.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in.js";

let checkInRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
    beforeEach(() => {
        checkInRepository = new InMemoryCheckInsRepository();
        sut = new CheckInUseCase(checkInRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("Should be able to check in", async () => {
        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("Should not to be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
        });

        await expect(() =>
            sut.execute({
                gymId: "gym-01",
                userId: "user-01",
            }),
        ).rejects.toBeInstanceOf(Error);
    });

    it("Should not to be able to check in twice but in different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
        });

        expect(checkIn).toEqual(expect.any(String));
    });
});
