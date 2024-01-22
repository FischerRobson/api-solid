import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { checkInRegister } from './register'
import { checkInHistory } from './history'
import { checkInMetrics } from './metrics'
import { checkInValidate } from './validate'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt) // every route will verify JWT now

  // app.get('/checkin/history')

  app.post('/gyms/:gymId/check-in', checkInRegister)
  app.get('/check-ins/history', checkInHistory)
  app.get('/check-ins/metrics', checkInMetrics)
  app.patch('/check-ins/:checkInId', checkInValidate)
}
