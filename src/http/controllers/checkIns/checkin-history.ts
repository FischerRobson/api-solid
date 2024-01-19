import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { makeCheckInService } from '@/services/factories/make-checkins-service'

export async function checkInHistory(req: FastifyRequest, res: FastifyReply) {
  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = querySchema.parse(req.query)

  const { checkIns } = await makeCheckInService().fetchCheckInHistory({
    userId: req.user.sub,
    page,
  })

  return res.status(HttpStatusCode.OK).send({ checkIns })
}
