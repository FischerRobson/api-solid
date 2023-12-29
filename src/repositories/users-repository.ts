import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findOneByEmail(email: string): Promise<User | null>
  findOneById(id: string): Promise<User | null>
}
