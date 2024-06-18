import z from 'zod'

export const WORKFLOW_SCHEMA = z.object({
  id: z.string(),
  workflowId: z.string(),
  version: z.number(),
  data: z.record(z.unknown()),
  createdAt: z.string().datetime()
})

export const GET_POC_PARAMS_SCHEMA = z.object({
  eventId: z.enum(['start', 'ContentImportedEvent', 'TmAppliedEvent', 'MtAppliedEvent', 'TaskCompletedEvent', 'error']),
})

export const GET_POC_RESPONSE_SCHEMA = z.object({
  data: WORKFLOW_SCHEMA,
})

export const NO_RESPONSE_SCHEMA = z.null()

export const STRING_RESPONSE_SCHEMA = z.string()

export type WORKFLOW_SCHEMA_TYPE = z.infer<typeof WORKFLOW_SCHEMA>

export type GET_POC_PARAMS_SCHEMA_TYPE = z.infer<typeof GET_POC_PARAMS_SCHEMA>
export type GET_POC_RESPONSE_SCHEMA_TYPE = z.infer<typeof GET_POC_RESPONSE_SCHEMA>
export type NO_RESPONSE_SCHEMA_TYPE = z.infer<typeof NO_RESPONSE_SCHEMA>
export type STRING_RESPONSE_SCHEMA_TYPE = z.infer<typeof STRING_RESPONSE_SCHEMA>
