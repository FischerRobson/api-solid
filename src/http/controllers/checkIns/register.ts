import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { makeCheckInService } from '@/services/factories/make-checkins-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CheckInLimitException } from '@/services/errors/check-in-limit-exception'
import { OutOfRangeGym } from '@/services/errors/out-of-range-gym'
import { ResourceNotFoundException } from '@/services/errors/resource-not-found-exception'

export async function checkInRegister(req: FastifyRequest, res: FastifyReply) {
  const bodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const paramsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const { latitude, longitude } = bodySchema.parse(req.body)
  const { gymId } = paramsSchema.parse(req.params)

  try {
    const { checkIn } = await makeCheckInService().doCheckIn({
      gymId,
      userId: req.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    return res.status(HttpStatusCode.Created).send({ checkIn })
  } catch (err) {
    if (err instanceof ResourceNotFoundException) {
      return res.status(HttpStatusCode.NotFound).send({ error: err.message })
    } else if (err instanceof OutOfRangeGym) {
      return res.status(HttpStatusCode.Conflict).send({ error: err.message })
    } else if (err instanceof CheckInLimitException) {
      return res.status(HttpStatusCode.Forbidden).send({ error: err.message })
    } else {
      throw err
    }
  }
}
