import { cleanRedis } from '../../../../test/RedisCleaner.js'
import type { TestContext } from '../../../../test/TestContext.js'
import { createTestContext, destroyTestContext } from '../../../../test/TestContext.js'

describe('DeleteOldUsersJob', () => {
  let testContext: TestContext

  beforeAll(async () => {
    testContext = await createTestContext()
    await cleanRedis(testContext.diContainer.cradle.redis)
  })

  afterAll(async () => {
    await destroyTestContext(testContext)
  })

  it('smoke test', async () => {
    // this job doesn't really do anything, so we can't assert much
    expect.assertions(0)
    const { deleteOldUsersJob } = testContext.diContainer.cradle
    await deleteOldUsersJob.process()
  })
})
