import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository copy.js";
import { beforeEach, describe, expect, it } from "vitest";
import { CheckInUseCase } from "./check-in.js";

let checkInRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Authenticate Use Case", () => {
    beforeEach(() => {
        checkInRepository = new InMemoryCheckInsRepository();
        sut = new CheckInUseCase(checkInRepository);
    });

    it("Should be able to check in", async () => {
        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });
});
