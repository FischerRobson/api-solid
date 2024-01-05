import { describe, it, beforeEach, expect, afterEach, vi } from 'vitest'

import { CheckInsService } from './checkins-service'
import { TestCheckInsRepository } from '@/repositories/test/test-checkins-repository'
import { TestGymsRepository } from '@/repositories/test/test-gyms-repository'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'
import { GymsRepository } from '@/repositories/gyms-repository'
import { OutOfRangeGym } from './errors/out-of-range-gym'
describe(`${CheckInsService.name}`, () => {
  let service: CheckInsService
  let gymsRepository: GymsRepository

  beforeEach(async () => {
    const checkInRepository = new TestCheckInsRepository()
    gymsRepository = new TestGymsRepository()
    service = new CheckInsService(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Gym',
      email: 'gym@mail.com',
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a checkin', async () => {
    vi.setSystemTime(new Date(2024, 0, 4, 17, 53, 0))

    const { checkIn } = await service.doCheckIn({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    console.log(checkIn.created_at)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to checkin twice in the same day', async () => {
    await service.doCheckIn({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(async () => {
      await service.doCheckIn({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to checkin twice in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 4, 17, 53, 0))

    const { checkIn } = await service.doCheckIn({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2024, 0, 5, 17, 53, 0))

    const { checkIn: secondCheckIn } = await service.doCheckIn({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
    expect(secondCheckIn.id).toEqual(expect.any(String))
  })

  it('should not be able to checkin a inexistent gym', async () => {
    await expect(async () => {
      await service.doCheckIn({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundException)
  })

  it('should not be able to checkin a distand gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'Gym',
      email: 'gym@mail.com',
      latitude: 22.571212,
      longitude: -47.4135471,
    })

    await expect(async () => {
      await service.doCheckIn({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: 22.5709077,
        userLongitude: -47.3483157,
      })
    }).rejects.toBeInstanceOf(OutOfRangeGym)
  })
})
