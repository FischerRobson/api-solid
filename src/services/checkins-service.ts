import { CheckInsRepository } from '@/repositories/checkins-repository'
import { CheckIn } from '@prisma/client'

type CheckInParams = {
  userId: string
  gymId: string
}

type CheckInResponse = {
  checkIn: CheckIn
}

export class CheckInsService {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async doCheckIn({ gymId, userId }: CheckInParams): Promise<CheckInResponse> {
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
