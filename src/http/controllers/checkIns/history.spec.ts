import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { checkInHistory } from './history'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { app } from '@/app'
import { HttpStatusCode } from '@/constants/HttpStatusCode'
import { prisma } from '@/lib/prisma'

describe(`${checkInHistory.name}`, () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the checkin history', async () => {
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

    await prisma.checkIn.createMany({
      data: [
        { gym_id: gym.id, user_id: user.id },
        { gym_id: gym.id, user_id: user.id },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/history?page=1')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(HttpStatusCode.OK)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
      }),
      expect.objectContaining({ gym_id: gym.id }),
    ])
  })
})
