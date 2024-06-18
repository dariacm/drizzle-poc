import z from 'zod'

export const API_ERROR_PAYLOAD = z.object({
  message: z.string(),
  errorCode: z.number(),
  details: z.optional(z.object({}).passthrough()),
})

export const API_ERROR = z.object({
  statusCode: z.number(),
  payload: API_ERROR_PAYLOAD,
})

export type API_ERROR_TYPE = z.infer<typeof API_ERROR>
