import { randomUUID } from 'crypto'

import type { InferInsertModel, InferSelectModel} from 'drizzle-orm';
import { sql } from 'drizzle-orm'
import { char, integer, json, pgTable, timestamp } from 'drizzle-orm/pg-core'

export const workflows = pgTable(
  'workflows',
  {
    id: char('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    version: integer('version').notNull(),
    data: json('data').notNull().$type<Record<string, unknown>>(),
    schema: json('schema').$type<Record<string, unknown>>(),
    createdAt: timestamp('timestamp').default(sql`now()`),
  }
)

export type Workflow = InferSelectModel<typeof workflows>
export type NewWorkflow = InferInsertModel<typeof workflows>
