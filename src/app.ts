import { PrismaPg } from "@prisma/adapter-pg";
import fastify from "fastify";
import { env } from "./env/index.js";
import { PrismaClient } from "./generated/prisma/client.js";

const connectionString = env.NODE_ENV;
export const app = fastify();

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

prisma.user.create({
    data: {
        name: "Diego",
        email: "email@gmail.com",
    },
});
