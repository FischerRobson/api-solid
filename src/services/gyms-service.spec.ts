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

  it('should be able to find a gym by its name', async () => {
    await service.registerGym({
      title: 'gym bombastic',
      description: 'some gym',
      email: 'gym@mail.com',
      latitude: 0,
      longitude: 0,
      phone: '19992988998',
    })

    const { gyms } = await service.searchGyms({ query: 'bombastic', page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'gym bombastic' })])
  })

  it('should be able to find nearby gyms', async () => {
    await service.registerGym({
      title: 'gym-01',
      description: 'some gym',
      email: 'gym@mail.com',
      latitude: 0,
      longitude: 0,
      phone: '19992988998',
    })

    await service.registerGym({
      title: 'gym-02',
      description: 'some gym',
      email: 'gym@mail.com',
      latitude: 1,
      longitude: 1,
      phone: '19992988998',
    })

    const { gyms } = await service.fetchNearbyGyms({
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'gym-01' })])
  })
})
