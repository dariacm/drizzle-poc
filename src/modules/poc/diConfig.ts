import type { Resolver } from 'awilix'
import { asClass } from 'awilix'

import type { CommonDependencies } from '../../infrastructure/commonDiConfig.js'
import type { DIOptions } from '../../infrastructure/diConfigUtils.js'
import { SINGLETON_CONFIG } from '../../infrastructure/parentDiConfig.js'

import { StateService } from './StateService'
import { SchemaRepository } from './repositories/SchemaRepository'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PocDiConfig = Record<keyof PocModuleDependencies, Resolver<any>>

export type PocModuleDependencies = {
  schemaRepository: SchemaRepository
  stateService: StateService
}

export type PocInjectableDependencies = PocModuleDependencies & CommonDependencies

export type PocPublicDependencies = Pick<
  PocInjectableDependencies,
  'stateService'
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function resolvePocConfig(options: DIOptions): PocDiConfig {
  return {
    schemaRepository: asClass(SchemaRepository, SINGLETON_CONFIG),
    stateService: asClass(StateService, SINGLETON_CONFIG),
  }
}
