import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { checkInRegister } from './register'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { app } from '@/app'
import { HttpStatusCode } from '@/constants/HttpStatusCode'

describe(`${checkInRegister.name}`, () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a checkIn', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // create gym
    const { body } = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym',
        description: 'some gym',
        phone: '1234567890',
        email: 'gym@mail.com',
        latitude: 1,
        longitude: 1,
      })

    const { gym } = body

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-in`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: 1,
        longitude: 1,
      })

    expect(response.status).toEqual(HttpStatusCode.Created)
  })
})
