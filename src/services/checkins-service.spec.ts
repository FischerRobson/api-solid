import { describe, it, beforeEach, expect, afterEach, vi } from 'vitest'

import { CheckInsService } from './checkins-service'
import { TestCheckInsRepository } from '@/repositories/test/test-checkins-repository'
import { TestGymsRepository } from '@/repositories/test/test-gyms-repository'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'
import { GymsRepository } from '@/repositories/gyms-repository'
import { OutOfRangeGym } from './errors/out-of-range-gym'
import { CheckInLimitException } from './errors/check-in-limit-exception'
import { CheckInsRepository } from '@/repositories/checkins-repository'
describe(`${CheckInsService.name}`, () => {
  let service: CheckInsService
  let gymsRepository: GymsRepository
  let checkInRepository: CheckInsRepository

  beforeEach(async () => {
    checkInRepository = new TestCheckInsRepository()
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
    }).rejects.toBeInstanceOf(CheckInLimitException)
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

  it('should be able to fetch checkIn history for an user', async () => {
    await service.doCheckIn({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    const { checkIns } = await service.fetchCheckInHistory({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(1)
    expect(checkIns).toEqual([expect.objectContaining({ gym_id: 'gym-01' })])
  })

  it('should be able to fetch checkIn paginated history for an user', async () => {
    for (let i = 0; i < 27; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await service.fetchCheckInHistory({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(7)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-20' }),
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
      expect.objectContaining({ gym_id: 'gym-23' }),
      expect.objectContaining({ gym_id: 'gym-24' }),
      expect.objectContaining({ gym_id: 'gym-25' }),
      expect.objectContaining({ gym_id: 'gym-26' }),
    ])
  })

  it('should be able to get user checkIns count', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkInsCount } = await service.getUserMetrics({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
