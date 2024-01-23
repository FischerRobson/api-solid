import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function refresh(req: FastifyRequest, res: FastifyReply) {
  await req.jwtVerify({ onlyCookie: true }) // look only cookie for refreshToken

  const token = await res.jwtSign(
    {},
    {
      sign: {
        sub: req.user.sub,
      },
    },
  )

  const refreshToken = await res.jwtSign(
    {},
    {
      sign: {
        sub: req.user.sub,
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
}
