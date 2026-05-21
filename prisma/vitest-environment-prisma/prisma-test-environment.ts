import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { Client } from 'pg';

function generateDataBaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schema);

  return url.toString();
}

export default {
  name: 'prisma',
  async setup() {
    const schema = randomUUID();
    const databaseUrl = generateDataBaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync('npx prisma migrate deploy');

    return {
      async teardown() {
        const client = new Client({ connectionString: databaseUrl });

        await client.connect();
        await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await client.end();
      },
    };
  },
};
