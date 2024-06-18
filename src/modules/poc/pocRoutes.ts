import type { Routes } from 'src/modules/routes'

import { getAwkward, getPlay, getPlayThrough } from './pocController'
import {
  GET_POC_PARAMS_SCHEMA,
  GET_POC_RESPONSE_SCHEMA,
  NO_RESPONSE_SCHEMA,
  STRING_RESPONSE_SCHEMA,
} from './pocSchemas'

export const pocRoutes: Routes = [
  {
    method: 'GET',
    url: `/poc/play`,
    handler: getPlayThrough,
    schema: {
      response: {
        200: STRING_RESPONSE_SCHEMA,
      },
      describe: 'Play through all states of the POC',
    },
  },
  {
    method: 'GET',
    url: `/poc/play/:eventId`,
    handler: getPlay,
    schema: {
      params: GET_POC_PARAMS_SCHEMA,
      response: {
        200: STRING_RESPONSE_SCHEMA,
      },
      describe: 'Play a single state. Use `start` eventId to start the POC, "ContentImportedEvent",' +
        ' "TmAppliedEvent", "MtAppliedEvent", "TaskCompletedEvent" to play through the POC',
    },
  },
  {
    method: 'GET',
    url: `/poc/awkward/:eventId`,
    handler: getAwkward,
    schema: {
      params: GET_POC_PARAMS_SCHEMA,
      response: {
        200: GET_POC_RESPONSE_SCHEMA,
      },
      describe: 'Test. If eventId is "error", custom error will be thrown, any undefined eventId will return validation error',
    },
  }
]
