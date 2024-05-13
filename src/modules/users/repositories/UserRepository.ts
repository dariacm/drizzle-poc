import { eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { inArray } from 'drizzle-orm/sql/expressions/conditions'

import type * as schema from '../../../db/schema/users'
import { users } from '../../../db/schema/users'
import type { UsersInjectableDependencies } from '../diConfig.js'
import type { UserUpdateDTO } from '../services/UserService'

type NewUser = schema.NewUser
type User = schema.User

export class UserRepository {
  private readonly drizzle: PostgresJsDatabase<typeof schema>

  constructor({ drizzle }: UsersInjectableDependencies) {
    this.drizzle = drizzle
  }

  async getUser(id: string): Promise<User | null> {
    const result = await this.drizzle.query.users.findFirst({ where: eq(users.id, id) })
    return result ?? null
  }

  async deleteUser(id: string): Promise<User | null> {
    const result = await this.drizzle.delete(users).where(eq(users.id, id)).returning()
    return result.length === 0 ? null : result[0]
  }

  async updateUser(id: string, updatedUser: UserUpdateDTO): Promise<User | null> {
    const result = await this.drizzle
      .update(users)
      .set(updatedUser)
      .where(eq(users.id, id))
      .returning()
    return result ? result[0] : null
  }

  getUsers(userIds: string[]): Promise<User[]> {
    return this.drizzle.select().from(users).where(inArray(users.id, userIds))
  }

  async createUser(user: NewUser): Promise<User> {
    const createdUser = await this.drizzle.insert(users).values(user).returning()
    return createdUser[0]
  }
}
