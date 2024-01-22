import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { userRegister } from './register'
import { HttpStatusCode } from '@/constants/HttpStatusCode'

describe(`${userRegister}`, () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to register a user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '12345678',
    })

    expect(response.statusCode).toEqual(HttpStatusCode.Created)
  })
})
