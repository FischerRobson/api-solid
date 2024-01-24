import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { InvalidCredentialsException } from '@/services/errors/invalid-credentials-exception'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = bodySchema.parse(req.body)

  try {
    const authenticateService = makeAuthenticateService()
    const { user } = await authenticateService.authenticate({ email, password })

    const token = await res.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await res.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return res
      .status(HttpStatusCode.OK)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsException) {
      return res
        .status(HttpStatusCode.Unauthorized)
        .send({ error: err.message })
    }
    throw err
  }
}
