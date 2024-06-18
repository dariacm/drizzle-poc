import type { FastifyReply, FastifyRequest } from 'fastify'

import { EntityNotFoundError } from '../../infrastructure/errors/publicErrors'
import type { ApiReply } from '../routes'

import type { GET_POC_PARAMS_SCHEMA_TYPE, GET_POC_RESPONSE_SCHEMA_TYPE } from './pocSchemas'

export const getPlay = async (
  req: FastifyRequest<{ Params: GET_POC_PARAMS_SCHEMA_TYPE }>,
  reply: FastifyReply,
): Promise<void> => {
  const { eventId } = req.params

  if (eventId === 'error') {
    throw new EntityNotFoundError({
      message: 'POC not found',
      details: {
        eventId,
      },
    })
  }

  const { stateService } = req.diScope.cradle

  await stateService.play(eventId)

  return reply.send('Playing state of the POC, see logs for details')
}

export const getPlayThrough = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const { stateService } = req.diScope.cradle

  stateService.playThrough()

  return reply.send('Playing through all states of the POC, see logs for details')
}

export const getAwkward = async (
  req: FastifyRequest<{ Params: GET_POC_PARAMS_SCHEMA_TYPE }>,
  reply: ApiReply<GET_POC_RESPONSE_SCHEMA_TYPE>,
): Promise<void> => {
  const { eventId } = req.params

  if (eventId === 'error') {
    throw new EntityNotFoundError({
      message: 'POC not found',
      details: {
        eventId,
      },
    })
  }

  return reply.send({
    data: {
      id: 'some-id',
      workflowId: 'some-workflow-id',
      version: 1,
      data: {
        eventId,
      },
      createdAt: new Date().toISOString(),
    },
  })
}