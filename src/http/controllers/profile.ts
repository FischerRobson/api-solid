import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { makeUsersService } from '@/services/factories/make-users-service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(req: FastifyRequest, res: FastifyReply) {
  const userService = makeUsersService()
  const { user } = await userService.getUserProfile({ id: req.user.sub })

  return res.status(HttpStatusCode.OK).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
