import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import {
  FindManyByLatitudeAndLongitudeParams,
  GymsRepository,
} from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    return await prisma.gym.create({ data })
  }

  async findById(id: string) {
    return await prisma.gym.findUnique({ where: { id } })
  }

  async findManyByQuery(query: string, page: number) {
    return await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async findManyByLatitudeAndLongitude({
    latitude,
    longitude,
  }: FindManyByLatitudeAndLongitudeParams) {
    // 10 is the max distance in KM
    return await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) 
          * cos( radians( latitude ) ) * cos( radians( longitude ) 
          - radians(${longitude}) ) + sin( radians(${latitude}) )
          * sin( radians( latitude ) ) ) ) <= 10
    `
  }
}
