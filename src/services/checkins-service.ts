import { CheckInsRepository } from '@/repositories/checkins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'
import { getDistanceBeetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { OutOfRangeGym } from './errors/out-of-range-gym'
import { CheckInLimitException } from './errors/check-in-limit-exception'

type DoCheckInParams = {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

type DoCheckInResponse = {
  checkIn: CheckIn
}

type FetchCheckInHistoryParams = {
  userId: string
  page: number
}

type FetchCheckInHistoryResponse = {
  checkIns: CheckIn[]
}

type GetUserMetricsParams = {
  userId: string
}

type GetUserMetricsResponse = {
  checkInsCount: number
}

type ValidateCheckInParams = {
  userId: string
  checkInId: string
}

type ValidateCheckInResponse = {
  checkIn: CheckIn
}

export class CheckInsService {
  private checkInsRepository: CheckInsRepository
  private gymsRepository: GymsRepository

  constructor(
    checkInsRepository: CheckInsRepository,
    gymsRepository: GymsRepository,
  ) {
    this.checkInsRepository = checkInsRepository
    this.gymsRepository = gymsRepository
  }

  async doCheckIn({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: DoCheckInParams): Promise<DoCheckInResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundException()
    }

    const distance = getDistanceBeetweenCoordinates(
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
    )

    const MAX_DISTANCE_IN_KMS = 0.1

    if (distance > MAX_DISTANCE_IN_KMS) {
      throw new OutOfRangeGym()
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new CheckInLimitException()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }

  async fetchCheckInHistory({
    userId,
    page,
  }: FetchCheckInHistoryParams): Promise<FetchCheckInHistoryResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }

  async getUserMetrics({
    userId,
  }: GetUserMetricsParams): Promise<GetUserMetricsResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }

  async validateCheckIn({
    checkInId,
    userId,
  }: ValidateCheckInParams): Promise<ValidateCheckInResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundException()
    }

    checkIn.validated_at = new Date()

    const savedCheckIn = await this.checkInsRepository.update(checkIn)

    return {
      checkIn: savedCheckIn,
    }
  }
}
