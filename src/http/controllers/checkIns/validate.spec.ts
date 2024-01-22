import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { checkInValidate } from './validate'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { app } from '@/app'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { prisma } from '@/lib/prisma'

describe(`${checkInValidate.name}`, () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate an checkin', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Gym',
        latitude: 1,
        longitude: 1,
        email: 'mail@mail.com',
      },
    })

    const checkIn = await prisma.checkIn.create({
      data: { gym_id: gym.id, user_id: user.id },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(HttpStatusCode.OK)
    expect(response.body.checkIn).toEqual(
      expect.objectContaining({
        id: checkIn.id,
      }),
    )
  })
})
