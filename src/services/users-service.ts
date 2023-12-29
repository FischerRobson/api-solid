import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsException } from './errors/user-already-exists-exception'
import { User } from '@prisma/client'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'

type RegisterUserParams = {
  name: string
  email: string
  password: string
}

type RegisterUserResponse = {
  user: User
}

type GetUserParams = {
  id: string
}

type GetUserResponse = {
  user: User
}

export class UsersService {
  private usersRepository: UsersRepository

  constructor(userRepository: UsersRepository) {
    this.usersRepository = userRepository
  }

  async registerUser({
    name,
    email,
    password,
  }: RegisterUserParams): Promise<RegisterUserResponse> {
    const userExists = await this.usersRepository.findOneByEmail(email)

    if (userExists) {
      throw new UserAlreadyExistsException()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })

    return {
      user,
    }
  }

  async getUserProfile({ id }: GetUserParams): Promise<GetUserResponse> {
    const user = await this.usersRepository.findOneById(id)

    if (!user) throw new ResourceNotFoundException()

    return {
      user,
    }
  }
}
