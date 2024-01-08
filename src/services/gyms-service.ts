import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

type RegisterGymParams = {
  title: string
  email: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

type RegisterGymResponse = {
  gym: Gym
}

export class GymsService {
  private gymsRepository: GymsRepository

  constructor(gymRepository: GymsRepository) {
    this.gymsRepository = gymRepository
  }

  async registerGym({
    title,
    description,
    email,
    latitude,
    longitude,
    phone,
  }: RegisterGymParams): Promise<RegisterGymResponse> {
    const gym = await this.gymsRepository.create({
      title,
      email,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}
