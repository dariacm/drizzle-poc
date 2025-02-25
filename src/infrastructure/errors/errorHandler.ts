import {
  isInternalError,
  isObject,
  isPublicNonRecoverableError,
  isStandardizedError,
} from '@lokalise/node-core'
import type { FastifyRequest, FastifyReply } from 'fastify'
import pino from 'pino'
import { ZodError } from 'zod'

import type { AppInstance } from '../../app.js'
import type { FreeformRecord } from '../../schemas/commonTypes.js'

const knownAuthErrors = new Set([
  'FST_JWT_NO_AUTHORIZATION_IN_HEADER',
  'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED',
  'FST_JWT_AUTHORIZATION_TOKEN_INVALID',
])

type ResponseObject = {
  statusCode: number
  payload: {
    message: string
    errorCode: string
    details?: FreeformRecord
  }
}

function resolveLogObject(error: unknown): FreeformRecord {
  if (isInternalError(error)) {
    return {
      message: error.message,
      code: error.errorCode,
      details: error.details ? JSON.stringify(error.details) : undefined,
      error: pino.stdSerializers.err({
        name: error.name,
        message: error.message,
        stack: error.stack,
      }),
    }
  }

  return {
    message: isObject(error) ? error.message : JSON.stringify(error),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    error: error instanceof Error ? pino.stdSerializers.err(error) : error,
  }
}

function resolveResponseObject(error: FreeformRecord): ResponseObject {
  if (isPublicNonRecoverableError(error)) {
    return {
      statusCode: error.httpStatusCode ?? 500,
      payload: {
        message: error.message,
        errorCode: error.errorCode,
        details: error.details,
      },
    }
  }

  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      payload: {
        message: 'Invalid params',
        errorCode: 'VALIDATION_ERROR',
        details: {
          error: error.issues,
        },
      },
    }
  }

  if (isStandardizedError(error)) {
    if (knownAuthErrors.has(error.code)) {
      const message =
        error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID'
          ? 'Authorization token is invalid'
          : error.message

      return {
        statusCode: 401,
        payload: {
          message,
          errorCode: 'AUTH_FAILED',
        },
      }
    }
  }

  return {
    statusCode: 500,
    payload: {
      message: 'Internal server error',
      errorCode: 'INTERNAL_SERVER_ERROR',
    },
  }
}

export const errorHandler = function (
  this: AppInstance,
  error: FreeformRecord,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const logObject = resolveLogObject(error)
  request.log.error(logObject)

  if (isInternalError(error)) {
    this.diContainer.cradle.errorReporter.report({ error })
  }

  const responseObject = resolveResponseObject(error)
  void reply.status(responseObject.statusCode).send(responseObject.payload)
}
