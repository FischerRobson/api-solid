import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function onlyAdmin(req: FastifyRequest, res: FastifyReply) {
  const { role } = req.user
  if (role !== 'ADMIN') {
    res.status(HttpStatusCode.Unauthorized).send({ message: 'Unauthorized' })
  }
}
