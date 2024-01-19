import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { makeGymsService } from '@/services/factories/make-gyms-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function gymsSearch(req: FastifyRequest, res: FastifyReply) {
  const querySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { page, query } = querySchema.parse(req.query)

  const { gyms } = await makeGymsService().searchGyms({ page, query })

  return res.status(HttpStatusCode.OK).send({ gyms })
}
