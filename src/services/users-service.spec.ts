import { describe, it, beforeEach, expect } from 'vitest'
import { UsersService } from './users-service'
import { compare } from 'bcryptjs'
import { TestUsersRepository } from '@/repositories/test/test-users-repository'
import { UserAlreadyExistsException } from './errors/user-already-exists-exception'

describe(`${UsersService.name}`, () => {
  let service: UsersService

  beforeEach(() => {
    service = new UsersService(new TestUsersRepository())
  })

  it('Should be able to register user', async () => {
    const { user } = await service.registerUser({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password', async () => {
    const password = '12345678'

    const { user } = await service.registerUser({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password,
    })

    const isPasswordHashedSuccesfully = await compare(
      password,
      user.password_hash,
    )

    expect(isPasswordHashedSuccesfully).toBeTruthy()
  })

  it('Should be not be able to register twice with same email', async () => {
    await service.registerUser({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    })

    await expect(async () => {
      await service.registerUser({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '12345678',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsException)
  })
})
