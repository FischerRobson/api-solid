import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../checkins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

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
    const startOfDay = dayjs(date).startOf('date')
    const endOfDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)

      const isOnSameDay =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay)

      return checkIn.user_id === userId && isOnSameDay
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    const initialIndex = (page - 1) * 20
    const finalIndex = page * 20

    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice(initialIndex, finalIndex)
  }
}
