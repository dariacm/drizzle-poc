import { randomUUID } from 'crypto'

import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { char, index, integer, pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

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

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
