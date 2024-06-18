import type { MachineContext } from 'xstate';
import { assign } from 'xstate'

export const WorkflowScheme : MachineContext = {
  id: 'workflows',
  initial: 'Idle',
  types: {} as {
    events: { type: 'ContentImportedEvent', resourceIds: number[] } | { type: 'TmAppliedEvent' } | { type: 'MtAppliedEvent' } | { type: 'TaskCompletedEvent' }
  },
  states: {
    Idle: {
      on: {
        ContentImportedEvent: {
          target: 'ApplyTranslationMemory',
          actions: assign({
            // @ts-ignore
            resourceIds: ({ event }) => event.resourceIds
          })
        }
      }
    },
    ApplyTranslationMemory: {
      on: {
        TmAppliedEvent: {
          target: 'TranslateWithMachineTranslation',
        }
      }
    },
    TranslateWithMachineTranslation: {
      on: {
        MtAppliedEvent: {
          target: 'CreateReviewTask',
        }
      }
    },
    CreateReviewTask: {
      on: {
        TaskCompletedEvent: {
          target: 'End',
        }
      }
    },
    End: {
      type: 'final',
    }
  },
}