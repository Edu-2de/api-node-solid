import { env } from '@/env/index.js';
import { PrismaClient } from '@/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = env.DATABASE_URL;

const pool = new Pool({ connectionString });

if (env.NODE_ENV === 'test') {
  const url = new URL(connectionString);
  const schema = url.searchParams.get('schema');

  if (schema) {
    pool.on('connect', (client) => {
      client.query(`SET search_path TO "${schema}", public`);
    });
  }
}

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
});

export { prisma };
