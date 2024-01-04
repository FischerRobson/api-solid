import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class TestUsersRepository implements UsersRepository {
  private items: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      email: data.email,
      created_at: new Date(),
      name: data.name,
      password_hash: data.password_hash,
    }

    this.items.push(user)

    return user
  }

  async findOneByEmail(email: string) {
    const user = this.items.find((e) => e.email === email)

    if (user) return user
    return null
  }

  async findOneById(id: string) {
    const user = this.items.find((e) => e.id === id)

    if (user) return user
    return null
  }
}
