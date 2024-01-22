import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { gymsSearch } from './search'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { app } from '@/app'
import { HttpStatusCode } from '@/constants/HttpStatusCode'

describe(`${gymsSearch.name}`, () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
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

    const response = await request(app.server)
      .get('/gyms/search?query=Gym&page=1') // or use .query({ query: '', page: '' })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(HttpStatusCode.OK)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Gym',
      }),
    ])
  })
})
