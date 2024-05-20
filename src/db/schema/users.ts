import { randomUUID } from 'crypto'

import { sql } from 'drizzle-orm'
import { char, index, integer, pgTable, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type z from 'zod'

export const users = pgTable(
  'users',
  {
    id: char('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    age: integer('age'),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
  },
  (table) => {
    return {
      ageNameIdx: index('age_name_idx')
        .on(table.age, table.name)
        .where(sql`age is not null`), // drizzle-kit only supports on() though
    }
  },
)

const insertUserSchema = createInsertSchema(users)
export type NewUser = z.infer<typeof insertUserSchema>

const selectUserSchema = createSelectSchema(users)
export type User = z.infer<typeof selectUserSchema>
