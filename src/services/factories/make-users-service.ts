import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersService } from '../users-service'

export function makeUsersService() {
  const usersRepository = new PrismaUsersRepository()
  const usersService = new UsersService(usersRepository)

  return usersService

  // function withPrisma() {
  //   const usersRepository = new PrismaUsersRepository()
  //   const usersService = new UsersService(usersRepository)

  //   return usersService
  // }

  // function withTest() {
  //   const usersRepository = new TestUsersRepository()
  //   const usersService = new UsersService(usersRepository)

  //   return usersService
  // }

  // return {
  //   withPrisma,
  //   withTest,
  // }
}
