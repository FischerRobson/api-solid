import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJwt(req: FastifyRequest, res: FastifyReply) {
  try {
    await req.jwtVerify()
  } catch {
    res.status(HttpStatusCode.Unauthorized).send({ message: 'Unauthorized' })
  }
}
