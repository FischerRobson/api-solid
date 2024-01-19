import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { profile } from './profile'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { object } from 'zod'

describe(`${profile}`, () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to authenticate a user', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '12345678',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@mail.com',
      password: '12345678',
    })

    const { token } = authResponse.body

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(HttpStatusCode.OK)
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@mail.com',
      }),
    )
  })
})
