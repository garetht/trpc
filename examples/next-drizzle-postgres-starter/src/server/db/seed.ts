import 'dotenv/config';

import { db, sql } from '.';
import { posts } from './schema';

async function main() {
  const firstPostId = '5c03994c-fc16-47e0-bd02-d218a370a078';

  await db
    .insert(posts)
    .values({
      id: firstPostId,
      title: 'First Post',
      text: 'This is an example post generated from `src/server/db/seed.ts`',
    })
    .onConflictDoUpdate({
      target: posts.id,
      set: {
        title: 'First Post',
        text: 'This is an example post generated from `src/server/db/seed.ts`',
      },
    });
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
