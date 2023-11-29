import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUserServiceParams {
  name: string
  email: string
  password: string
}

export async function registerUser({
  name,
  email,
  password,
}: RegisterUserServiceParams) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    throw new Error('Email already exists')
  }

  const passwordHash = await hash(password, 6)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  })
}
