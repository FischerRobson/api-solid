import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { CheckInExpiratedException } from '@/services/errors/check-in-expirated-exception'
import { ResourceNotFoundException } from '@/services/errors/resource-not-found-exception'
import { makeCheckInService } from '@/services/factories/make-checkins-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function checkInValidate(req: FastifyRequest, res: FastifyReply) {
  const paramsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = paramsSchema.parse(req.params)

  try {
    const { checkIn } = await makeCheckInService().validateCheckIn({
      checkInId,
    })

    return res.status(HttpStatusCode.OK).send({ checkIn })
  } catch (err) {
    if (err instanceof ResourceNotFoundException) {
      return res.status(HttpStatusCode.NotFound).send({ error: err.message })
    } else if (err instanceof CheckInExpiratedException) {
      return res.status(HttpStatusCode.Conflict).send({ error: err.message })
    } else {
      throw err
    }
  }
}
