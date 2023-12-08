import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsException } from './errors/user-already-exists-exception'

interface RegisterUserServiceParams {
  name: string
  email: string
  password: string
}

export class UsersService {
  private usersRepository: UsersRepository

  constructor(userRepository: UsersRepository) {
    this.usersRepository = userRepository
  }

  async registerUser({ name, email, password }: RegisterUserServiceParams) {
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

    return user
  }
}
