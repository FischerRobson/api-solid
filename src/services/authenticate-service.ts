import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsException } from './errors/invalid-credentials-exception'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

type AuthenticateParams = {
  email: string
  password: string
}

type AuthenticateServiceResponse = {
  user: User
}

export class AuthenticateService {
  private usersRepository: UsersRepository

  constructor(repository: UsersRepository) {
    this.usersRepository = repository
  }

  async authenticate({
    email,
    password,
  }: AuthenticateParams): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findOneByEmail(email)

    if (!user) throw new InvalidCredentialsException()

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) throw new InvalidCredentialsException()

    return {
      user,
    }
  }
}
