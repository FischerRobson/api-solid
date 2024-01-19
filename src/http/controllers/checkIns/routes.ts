import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { checkInRegister } from './checkin-register'
import { checkInHistory } from './checkin-history'
import { checkInMetrics } from './checkin-metrics'
import { checkInValidate } from './checkin-validate'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt) // every route will verify JWT now

  // app.get('/checkin/history')

  app.post('gyms/:gymId/check-in', checkInRegister)
  app.get('/check-in/history', checkInHistory)
  app.get('/check-in/metrics', checkInMetrics)
  app.put('/check-in/:checkInId', checkInValidate)
}
