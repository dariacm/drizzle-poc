import { asFunction } from 'awilix'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { FastifyInstance } from 'fastify'
import type Redis from 'ioredis'

import type { AppInstance } from '../app.js'
import { getApp } from '../app.js'
import type * as schema from '../db/schema/users'

import { dbHealthCheck, redisHealthCheck } from './healthchecks.js'

const createRedisMock = (pingLatency: number, response = 'PONG') =>
  ({
    ping: () => new Promise((resolve) => setTimeout(resolve, pingLatency, response)),
  }) as Pick<Redis, 'ping'>

const createDrizzleMock = (shouldSucceed: boolean) =>
  ({
    execute: () => {
      if (shouldSucceed) {
        return Promise.resolve([{ 1: 1n }])
      }
      throw new Error(
        "Can't reach database server at `test-service.server.test`:`1234`\n\nPlease make sure your database server is running at `test-service.server.test`:`1234`.",
      )
    },
  }) as unknown as Pick<PostgresJsDatabase<typeof schema>, 'execute'>

describe('healthcheck', () => {
  let app: AppInstance
  beforeEach(async () => {
    app = await getApp()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('DB healthcheck', () => {
    it('Fails on unexpected DB response', async () => {
      app.diContainer.register(
        'drizzle',
        asFunction(() => createDrizzleMock(false)),
      )

      const result = await dbHealthCheck(app as unknown as FastifyInstance)
      expect(result.result).toBeUndefined()
      expect(result.error).toBeDefined()
    })

    it('Does not fail on successful DB ping', async () => {
      app.diContainer.register(
        'drizzle',
        asFunction(() => createDrizzleMock(true)),
      )

      const result = await dbHealthCheck(app as unknown as FastifyInstance)
      expect(result.result).toBeDefined()
      expect(result.error).toBeUndefined()
    })
  })

  describe('Redis healthcheck', () => {
    it('Fails on unexpected Redis response', async () => {
      void app.diContainer.register(
        'redis',
        asFunction(() => createRedisMock(0, '')),
      )

      const result = await redisHealthCheck(app as unknown as FastifyInstance)
      expect(result).toMatchObject({
        error: new Error('Redis did not respond with PONG'),
      })
    })

    it('Fails on timeout', async () => {
      const { redis } = app.diContainer.cradle
      redis.disconnect()

      expect.assertions(1)
      const promise = redisHealthCheck(app as unknown as FastifyInstance)

      await expect(promise).resolves.toMatchObject({
        error: new Error('Redis did not respond with PONG'),
      })
    })

    it('Does not fail on successful Redis ping', async () => {
      app.diContainer.register(
        'redis',
        asFunction(() => createRedisMock(0)),
      )

      const result = await redisHealthCheck(app as unknown as FastifyInstance)
      expect(result).toMatchObject({
        result: true,
      })
    })
  })
})
