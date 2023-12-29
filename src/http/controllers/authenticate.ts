import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '@/services/authenticate-service'
import { InvalidCredentialsException } from '@/services/errors/invalid-credentials-exception'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = bodySchema.parse(req.body)

  try {
    const authenticateService = new AuthenticateService(
      new PrismaUsersRepository(),
    )
    await authenticateService.authenticate({ email, password })

    return res.status(HttpStatusCode.OK).send()
  } catch (err) {
    if (err instanceof InvalidCredentialsException) {
      return res
        .status(HttpStatusCode.Unauthorized)
        .send({ error: err.message })
    }
    throw err
  }
}
