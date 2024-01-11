import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(req: FastifyRequest, res: FastifyReply) {
  await req.jwtVerify()

  const { user } = req

  return res.send(HttpStatusCode.OK)
}
