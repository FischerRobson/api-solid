import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { registerUser } from '@/services/registerUser'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = bodySchema.parse(req.body)

  try {
    await registerUser({ name, email, password })
    return res.status(HttpStatusCode.Created).send()
  } catch (err) {}
}
