import { env } from "@/env/index.js";
import { PrismaClient } from "@/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
    adapter,
    log: env.NODE_ENV === "dev" ? ["query"] : [],
});

export { prisma };
