import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJwt {
    // payload: {}
    user: {
      sub: string
    }
  }
}
