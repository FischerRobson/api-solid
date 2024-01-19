import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { gymsSearch } from './gyms-search'
import { gymRegister } from './gym-register'
import { gymsNearby } from './gyms-nearby'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt) // every route will verify JWT now

  app.get('/gyms/search', gymsSearch)
  app.post('/gyms', gymRegister)
  app.get('/gyms/nearby', gymsNearby)
}
