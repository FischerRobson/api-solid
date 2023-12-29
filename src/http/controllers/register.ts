import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { UsersService } from '@/services/users-service'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsException } from '@/services/errors/user-already-exists-exception'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = bodySchema.parse(req.body)

  try {
    const userService = new UsersService(new PrismaUsersRepository())
    const user = await userService.registerUser({ name, email, password })

    return res.status(HttpStatusCode.Created).send(user)
  } catch (err) {
    if (err instanceof UserAlreadyExistsException) {
      return res.status(HttpStatusCode.Conflict).send({ error: err.message })
    }
    throw err
  }
}
