import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '../env';
import * as schema from './schema';

type DrizzleDb = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as typeof globalThis & {
  db?: DrizzleDb;
  sql?: ReturnType<typeof postgres>;
};

export const sql =
  globalForDb.sql ??
  postgres(env.DATABASE_URL, {
    max: 1,
    onnotice: () => undefined,
  });

export const db: DrizzleDb = globalForDb.db ?? drizzle(sql, { schema });

if (env.NODE_ENV !== 'production') {
  globalForDb.db = db;
  globalForDb.sql = sql;
}
