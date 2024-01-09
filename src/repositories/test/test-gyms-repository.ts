import { Gym, Prisma } from '@prisma/client'
import {
  FindManyByLatitudeAndLongitudeParams,
  GymsRepository,
} from '../gyms-repository'
import { randomUUID } from 'crypto'
import { Decimal } from '@prisma/client/runtime/library'
import { getDistanceBeetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class TestGymsRepository implements GymsRepository {
  private items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id || randomUUID(),
      email: data.email,
      title: data.title,
      description: data.description || null,
      phone: data.phone || null,
      latitude: new Decimal(Number(data.latitude)),
      longitude: new Decimal(Number(data.longitude)),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.items.find((e) => e.id === id)

    if (gym) return gym
    return null
  }

  async findManyByQuery(query: string, page: number) {
    const initialIndex = (page - 1) * 20
    const finalIndex = page * 20

    return this.items
      .filter((gym) => gym.title.includes(query))
      .slice(initialIndex, finalIndex)
  }

  async findManyByLatitudeAndLongitude({
    latitude,
    longitude,
  }: FindManyByLatitudeAndLongitudeParams) {
    const MAX_DISTANCE_IN_KMS = 10

    return this.items.filter((gym) => {
      const distance = getDistanceBeetweenCoordinates(
        { latitude, longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )
      return distance < MAX_DISTANCE_IN_KMS
    })
  }
}
