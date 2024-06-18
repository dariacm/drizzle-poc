import { eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { MachineContext } from 'xstate'

import type * as schema from '../../../db/schema/workflows'
import { workflows } from '../../../db/schema/workflows'
import type { PocInjectableDependencies } from '../diConfig.js'

type Workflow = schema.Workflow
type NewWorkflow = schema.NewWorkflow

export class SchemaRepository {
  private readonly drizzle: PostgresJsDatabase<typeof schema>

  constructor({ drizzle }: PocInjectableDependencies) {
    this.drizzle = drizzle
  }

  async getSchema(id: string): Promise<Workflow | null> {
    const result = await this.drizzle.query.workflows.findFirst({ where: eq(workflows.id, id) })
    return result ?? null
  }

  async upsertSchema(id: string, data: MachineContext): Promise<void> {
    await this.drizzle.insert(workflows).values({
      id,
      version: 1,
      data
    } satisfies NewWorkflow).onConflictDoUpdate({
      target: [workflows.id],
      set: { data }
    })
  }
}
