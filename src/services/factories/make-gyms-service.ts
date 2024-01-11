import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GymsService } from '../gyms-service'

export function makeGymsService() {
  return new GymsService(new PrismaGymsRepository())
}
