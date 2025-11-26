import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const posts = pgTable('Post', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: false }).defaultNow().notNull(),
});
