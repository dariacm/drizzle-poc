import type { DataSource } from 'layered-loader'

import type { User } from '../../../db/schema/users'
import type { UsersInjectableDependencies } from '../diConfig.js'
import type { UserRepository } from '../repositories/UserRepository.js'

export class UserDataSource implements DataSource<User> {
  name = 'User loader'
  private userRepository: UserRepository

  constructor({ userRepository }: UsersInjectableDependencies) {
    this.userRepository = userRepository
  }

  async get(userId: string): Promise<User | null> {
    const result = await this.userRepository.getUser(userId)
    return result ?? null
  }

  getMany(keys: string[]): Promise<User[]> {
    return this.userRepository.getUsers(keys)
  }
}
