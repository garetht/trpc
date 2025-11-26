/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { and, desc, eq, lt, or } from 'drizzle-orm';

import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '~/server/db';
import { posts } from '~/server/db/schema';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to avoid leaking extra information.
 */
const defaultPostSelect = {
  id: posts.id,
  title: posts.title,
  text: posts.text,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
};

export const postRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/v11/useInfiniteQuery
       */

      const limit = input.limit ?? 50;
      const { cursor } = input;

      let cursorPost:
        | Awaited<ReturnType<typeof db.query.posts.findFirst>>
        | undefined;

      if (cursor) {
        cursorPost = await db.query.posts.findFirst({
          where: eq(posts.id, cursor),
        });
      }

      const items = cursorPost
        ? await db
            .select(defaultPostSelect)
            .from(posts)
            // get an extra item at the end which we'll use as next cursor
            .where(
              or(
                lt(posts.createdAt, cursorPost.createdAt),
                and(
                  eq(posts.createdAt, cursorPost.createdAt),
                  lt(posts.id, cursorPost.id),
                ),
              ),
            )
            .orderBy(desc(posts.createdAt), desc(posts.id))
            .limit(limit + 1)
        : await db
            .select(defaultPostSelect)
            .from(posts)
            // get an extra item at the end which we'll use as next cursor
            .orderBy(desc(posts.createdAt), desc(posts.id))
            .limit(limit + 1);
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, id),
        columns: {
          id: true,
          title: true,
          text: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }
      return post;
    }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().min(1).max(32),
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const insertValues: typeof posts.$inferInsert = {
        title: input.title,
        text: input.text,
      };

      if (input.id) {
        insertValues.id = input.id;
      }

      const [post] = await db
        .insert(posts)
        .values(insertValues)
        .returning(defaultPostSelect);
      return post;
    }),
});
