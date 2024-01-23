import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { usersRoutes } from './http/controllers/users/routes'

import { env } from './env'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/checkIns/routes'

export const app = fastify()

app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(usersRoutes) // using routes as plugin
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((err, req, res) => {
  if (env.NODE_ENV !== 'prod') console.error(err)

  if (err instanceof ZodError) {
    return res.status(400).send({ error: err.format() })
  }

  return res.status(500).send({ error: 'Interal Server Error' })
})
