import { FastifyInstance } from 'fastify'
import { userRegister } from './user-register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJwt } from '../../middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', userRegister)
  app.post('/sessions', authenticate)

  // Authenticated routes
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
