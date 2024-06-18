import type { MachineContext, Snapshot} from 'xstate';
import { createActor, createMachine } from 'xstate'

import { EntityNotFoundError } from '../../infrastructure/errors/publicErrors'

import type { PocInjectableDependencies } from './diConfig'
import type { GET_POC_PARAMS_SCHEMA_TYPE } from './pocSchemas'
import type { SchemaRepository } from './repositories/SchemaRepository'
import { WorkflowScheme } from './resources/initial'

type EVENT_ID = GET_POC_PARAMS_SCHEMA_TYPE['eventId']

export class StateService {
  private readonly schemaRepository: SchemaRepository

  private readonly workflowScheme: MachineContext
  private readonly resourceIds = [5, 99, 640]
  private readonly schemaId = '95885afd-1505-4181-885a-fd15058181a7'
  private readonly persistSchemas = false

  constructor({ schemaRepository }: PocInjectableDependencies) {
    this.schemaRepository = schemaRepository
    this.workflowScheme = WorkflowScheme
  }

  // eslint-disable-next-line max-statements
  public async play(eventId: EVENT_ID): Promise<void> {
    console.log(`Playing event ${eventId}`)

    if (eventId === 'start') {
      const workflowsMachine = createMachine(this.workflowScheme)
      const actor = createActor(workflowsMachine, {
        snapshot: undefined
      })
      const snapshot = actor.getPersistedSnapshot()
      console.log('Snapshot:', snapshot)
      console.log('JSON string:', JSON.stringify(snapshot, null, 2))
      await this.schemaRepository.upsertSchema(this.schemaId, snapshot, this.workflowScheme)
      return
    }

    const workflow = await this.schemaRepository.getSchema(this.schemaId)
    if (!workflow) {
      throw new EntityNotFoundError({ message: 'Schema not found. Use `start` event to create a new scheme.' })
    }

    console.log('Snapshot:', workflow.data)
    console.log('Schema:', workflow.schema)
    // @ts-ignore
    console.log('Schema actions:', workflow.schema?.states?.Idle.on.ContentImportedEvent)

    const schema = this.persistSchemas ? workflow.schema as MachineContext : this.workflowScheme
    const workflowsMachine = createMachine(schema)

    const actor = createActor(workflowsMachine, {
      snapshot: workflow.data as Snapshot<unknown>
    })

    actor.subscribe((snapshot) => {
      console.info('Value changed:', snapshot.value, snapshot.context)
    })

    actor.start()

    if (eventId === 'ContentImportedEvent') {
      actor.send({ type: eventId, resourceIds: this.resourceIds })
    } else {
      actor.send({ type: eventId })
    }

    const snapshot = actor.getPersistedSnapshot()
    await this.schemaRepository.upsertSchema(this.schemaId, snapshot, schema)
  }

  public playThrough(): void {
    const workflowsMachine = createMachine(this.workflowScheme)

    const actor = createActor(workflowsMachine)

    actor.subscribe((snapshot) => {
      console.info('Value changed:', snapshot.value, snapshot.context)
    })

    actor.start()

    actor.send({ type: 'ContentImportedEvent', resourceIds: this.resourceIds })
    actor.send({ type: 'TmAppliedEvent' })
    actor.send({ type: 'MtAppliedEvent' })
    actor.send({ type: 'TaskCompletedEvent' })
  }
}