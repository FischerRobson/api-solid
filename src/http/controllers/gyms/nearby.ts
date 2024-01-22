import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { makeGymsService } from '@/services/factories/make-gyms-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function gymsNearby(req: FastifyRequest, res: FastifyReply) {
  const querySchema = z.object({
    userLatitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    userLongitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { userLatitude, userLongitude } = querySchema.parse(req.query)

  const { gyms } = await makeGymsService().fetchNearbyGyms({
    userLatitude,
    userLongitude,
  })

  return res.status(HttpStatusCode.OK).send({ gyms })
}
