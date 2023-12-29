import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }

  async findOneByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } })
  }

  async findOneById(id: string) {
    return await prisma.user.findUnique({ where: { id } })
  }
}
