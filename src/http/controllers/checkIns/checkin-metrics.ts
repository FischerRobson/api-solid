import { FastifyReply, FastifyRequest } from 'fastify'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { makeCheckInService } from '@/services/factories/make-checkins-service'

export async function checkInMetrics(req: FastifyRequest, res: FastifyReply) {
  const { checkInsCount } = await makeCheckInService().getUserMetrics({
    userId: req.user.sub,
  })

  return res.status(HttpStatusCode.OK).send({ checkInsCount })
}
