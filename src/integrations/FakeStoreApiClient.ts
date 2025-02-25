import { buildClient, sendGet } from '@lokalise/node-core'
import type { Client } from 'undici'

import type { CommonDependencies } from '../infrastructure/commonDiConfig.js'
import type { FreeformRecord } from '../schemas/commonTypes.js'

export class FakeStoreApiClient {
  private readonly client: Client

  constructor({ config }: CommonDependencies) {
    this.client = buildClient(config.integrations.fakeStore.baseUrl)
  }

  async getProduct(productId: number) {
    const response = await sendGet<FreeformRecord>(this.client, `/products/${productId}`, {
      retryConfig: {
        statusCodesToRetry: [500, 502, 503],
        retryOnTimeout: false,
        maxAttempts: 5,
        delayBetweenAttemptsInMsecs: 200,
      },
    })

    return response.result.body
  }
}
