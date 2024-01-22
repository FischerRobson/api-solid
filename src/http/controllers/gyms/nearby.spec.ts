import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { gymsNearby } from './nearby'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { app } from '@/app'
import { HttpStatusCode } from '@/constants/HttpStatusCode'

describe(`${gymsNearby.name}`, () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list all nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym',
        description: 'some gym',
        phone: '1234567890',
        email: 'gym@mail.com',
        latitude: 0,
        longitude: 0,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'CBUM gym',
        description: 'the gym of Cbum',
        phone: '1234567890',
        email: 'cbum@mail.com',
        latitude: 1,
        longitude: 1,
      })

    const response = await request(app.server)
      .get('/gyms/nearby?userLatitude=1&userLongitude=1')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(HttpStatusCode.OK)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'CBUM gym',
      }),
    ])
  })
})
