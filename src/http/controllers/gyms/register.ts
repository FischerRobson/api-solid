import { HttpStatusCode } from '@/constants/HttpStatusCode'

import { makeGymsService } from '@/services/factories/make-gyms-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function gymRegister(req: FastifyRequest, res: FastifyReply) {
  const bodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    email: z.string().email(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, email, phone, latitude, longitude } =
    bodySchema.parse(req.body)

  const { gym } = await makeGymsService().registerGym({
    title,
    description,
    email,
    phone,
    latitude,
    longitude,
  })

  return res.status(HttpStatusCode.Created).send({ gym })
}
