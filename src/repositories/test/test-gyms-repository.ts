import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { Decimal } from '@prisma/client/runtime/library'

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
}
