import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { makeGymsService } from '@/services/factories/make-gyms-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function gymsNearby(req: FastifyRequest, res: FastifyReply) {
  const bodySchema = z.object({
    userLatitude: z.coerce.number(),
    userLongitude: z.coerce.number(),
  })

  const { userLatitude, userLongitude } = bodySchema.parse(req.params)

  const { gyms } = await makeGymsService().fetchNearbyGyms({
    userLatitude,
    userLongitude,
  })

  return res.status(HttpStatusCode.OK).send({ gyms })
}
