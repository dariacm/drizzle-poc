import { sql } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import type * as schema from '../src/db/schema/users'

export enum DB_MODEL {
  Users = 'users',
}

export async function cleanTables(
  drizzle: PostgresJsDatabase<typeof schema>,
  modelNames: readonly DB_MODEL[],
) {
  for (const model of modelNames) {
    const tableName = model.valueOf()
    await drizzle.execute(sql.raw(`delete from ${tableName}`))
  }
}
