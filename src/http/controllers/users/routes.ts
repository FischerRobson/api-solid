import { FastifyInstance } from 'fastify'
import { userRegister } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', userRegister)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  // Authenticated routes
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
