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

type SearchGymsParams = {
  query: string
  page: number
}

type SearchGymsResponse = {
  gyms: Gym[]
}

type FetchNearbyGymsParams = {
  userLatitude: number
  userLongitude: number
}

type FetchNearbyGymsResponse = {
  gyms: Gym[]
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

  async searchGyms({
    query,
    page,
  }: SearchGymsParams): Promise<SearchGymsResponse> {
    const gyms = await this.gymsRepository.findManyByQuery(query, page)

    return {
      gyms,
    }
  }

  async fetchNearbyGyms({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsParams): Promise<FetchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyByLatitudeAndLongitude({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
