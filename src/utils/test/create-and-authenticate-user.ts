import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password_hash: await hash('12345678', 6),
      role: 'ADMIN',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@mail.com',
    password: '12345678',
  })

  const { token } = authResponse.body

  return { token }
}
