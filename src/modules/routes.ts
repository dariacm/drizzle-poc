import type http from 'node:http'

import type { CommonLogger } from '@lokalise/node-core'
import type { FastifyReply, RouteOptions } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { pocRoutes } from './poc'
import type { API_ERROR_TYPE } from './schemas'
import { getUserRoutes } from './users'

export interface ApiReply<P extends Record<string, unknown>> extends FastifyReply {
  send(payload: P | API_ERROR_TYPE): FastifyReply
  status(statusCode: API_ERROR_TYPE['statusCode']): FastifyReply
}

export type Routes = Array<
  RouteOptions<
    http.Server,
    http.IncomingMessage,
    http.ServerResponse,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    ZodTypeProvider,
    CommonLogger
  >
>

export function getRoutes(): {
  routes: Routes
} {
  const { routes: userRoutes } = getUserRoutes()

  return {
    routes: [
      ...userRoutes,
      ...pocRoutes,
    ],
  }
}
