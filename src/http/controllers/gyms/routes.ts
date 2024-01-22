import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { gymsSearch } from './search'
import { gymRegister } from './register'
import { gymsNearby } from './nearby'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt) // every route will verify JWT now

  app.get('/gyms/search', gymsSearch)
  app.post('/gyms', gymRegister)
  app.get('/gyms/nearby', gymsNearby)
}
