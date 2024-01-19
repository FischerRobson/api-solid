import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { authenticate } from './authenticate'
import { HttpStatusCode } from '@/constants/HttpStatusCode'

describe(`${authenticate}`, () => {
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

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@mail.com',
      password: '12345678',
    })

    expect(response.statusCode).toEqual(HttpStatusCode.OK)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
