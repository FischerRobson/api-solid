import { Gym, Prisma } from '@prisma/client'

export type FindManyByLatitudeAndLongitudeParams = {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  findManyByQuery(query: string, page: number): Promise<Gym[]>
  findManyByLatitudeAndLongitude(
    params: FindManyByLatitudeAndLongitudeParams,
  ): Promise<Gym[]>
}
