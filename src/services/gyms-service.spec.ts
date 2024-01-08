import { describe, it, beforeEach, expect } from 'vitest'
import { GymsService } from './gyms-service'
import { TestGymsRepository } from '@/repositories/test/test-gyms-repository'

describe(`${GymsService.name}`, () => {
  let service: GymsService

  beforeEach(() => {
    const repository = new TestGymsRepository()
    service = new GymsService(repository)
  })

  it('should be able to create a new gym', async () => {
    const { gym } = await service.registerGym({
      title: 'gym',
      description: 'some gym',
      email: 'gym@mail.com',
      latitude: 0,
      longitude: 0,
      phone: '19992988998',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
