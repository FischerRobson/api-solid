import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { gymRegister } from './register'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { app } from '@/app'
import { HttpStatusCode } from '@/constants/HttpStatusCode'

describe(`${gymRegister.name}`, () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym',
        description: 'the gym of Cbum',
        phone: '1234567890',
        email: 'gym@mail.com',
        latitude: 1,
        longitude: 1,
      })

    expect(response.status).toEqual(HttpStatusCode.Created)
    expect(response.body.gym).toEqual(
      expect.objectContaining({
        title: 'Gym',
      }),
    )
  })
})
