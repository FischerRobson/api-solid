import { describe, it, beforeEach, expect } from 'vitest'
import { UsersService } from './users-service'
import { compare } from 'bcryptjs'
import { TestUsersRepository } from '@/repositories/test/test-users-repository'
import { UserAlreadyExistsException } from './errors/user-already-exists-exception'
import { ResourceNotFoundException } from './errors/resource-not-found-exception'

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

  it('Should not be able to register twice with same email', async () => {
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

  it('Should be able to get user profile', async () => {
    const { user } = await service.registerUser({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    })

    const { user: userProfile } = await service.getUserProfile({ id: user.id })
    expect(userProfile.id).toEqual(user.id)
  })

  it('Should not be able to get user profile without valid id', async () => {
    await expect(async () => {
      await service.getUserProfile({
        id: '123',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundException)
  })
})
