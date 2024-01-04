import { describe, it, beforeEach, expect, afterEach, vi } from 'vitest'

import { CheckInsService } from './checkins-service'
import { TestCheckInsRepository } from '@/repositories/test/test-checkins-repository'
describe(`${CheckInsService.name}`, () => {
  let service: CheckInsService

  beforeEach(async () => {
    const repository = new TestCheckInsRepository()
    service = new CheckInsService(repository)

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
    })

    console.log(checkIn.created_at)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to checkin twice in the same day', async () => {
    await service.doCheckIn({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await expect(async () => {
      await service.doCheckIn({
        gymId: 'gym-01',
        userId: 'user-01',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to checkin twice in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 4, 17, 53, 0))

    const { checkIn } = await service.doCheckIn({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    vi.setSystemTime(new Date(2024, 0, 5, 17, 53, 0))

    const { checkIn: secondCheckIn } = await service.doCheckIn({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
    expect(secondCheckIn.id).toEqual(expect.any(String))
  })
})
