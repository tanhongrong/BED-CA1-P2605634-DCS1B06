// https://orm.drizzle.team/docs/overview

// src/db/schema.js
import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  username:  text('username').notNull().unique(),
  email:     text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

// One-to-one: one user has exactly one profile
export const userProfiles = sqliteTable('user_profiles', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  userId:    integer('user_id').notNull().unique().references(() => users.id),
  firstName: text('first_name'),
  lastName:  text('last_name'),
  bio:       text('bio'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});