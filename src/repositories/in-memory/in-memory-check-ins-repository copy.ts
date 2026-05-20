import type { CheckIn } from "@/generated/prisma/client.js";
import type { CheckInUncheckedCreateInput } from "@/generated/prisma/models.js";
import { randomUUID } from "node:crypto";
import type { CheckInsRepository } from "../check-ins-repository.js";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = [];

    async findByUserIdOnDate(userId: string, date: Date) {
        const findUserIdInDate = this.items.find(
            (checkIn) => checkIn.user_id === userId,
        );
        if (!findUserIdInDate) {
            return null;
        }
        return findUserIdInDate;
    }

    async create(data: CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gymId: data.gymId,
            validated_at: data.validated_at
                ? new Date(data.validated_at)
                : null,
            created_at: new Date(),
        };

        this.items.push(checkIn);

        return checkIn;
    }
}
