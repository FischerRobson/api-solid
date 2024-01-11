import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-checkins-repository'
import { CheckInsService } from '../checkins-service'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeGymsService() {
  return new CheckInsService(
    new PrismaCheckInsRepository(),
    new PrismaGymsRepository(),
  )
}
