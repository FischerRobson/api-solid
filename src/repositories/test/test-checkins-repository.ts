import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../checkins-repository'
import { randomUUID } from 'node:crypto'

export class TestCheckInsRepository implements CheckInsRepository {
  private items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const checkInOnSameDate = this.items.find((e) => e.user_id === userId)

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }
}
