import 'dotenv/config';

import { sql } from '.';

async function main() {
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`;

  await sql`
    CREATE TABLE IF NOT EXISTS "Post" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "title" text NOT NULL,
      "text" text NOT NULL,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE OR REPLACE FUNCTION set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW."updatedAt" = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;

  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_timestamp_post'
      ) THEN
        CREATE TRIGGER set_timestamp_post
        BEFORE UPDATE ON "Post"
        FOR EACH ROW
        EXECUTE FUNCTION set_timestamp();
      END IF;
    END;
    $$;
  `;
}

void main()
  .then(async () => {
    await sql.end({ timeout: 5 });
  })
  .catch(async (err) => {
    console.error(err);
    await sql.end({ timeout: 5 });
    process.exit(1);
  });
