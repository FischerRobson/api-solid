import { describe, it, beforeEach, expect } from 'vitest'
import { AuthenticateService } from './authenticate-service'
import { TestUsersRepository } from '@/repositories/test/test-users-repository'
import { hash } from 'bcryptjs'
import { User } from '@prisma/client'
import { InvalidCredentialsException } from './errors/invalid-credentials-exception'

describe(`${AuthenticateService.name}`, () => {
  let service: AuthenticateService

  const mockedEmail = 'johndoe@email.com'
  const mockedPassword = '12345678'

  let user: User

  beforeEach(async () => {
    const repository = new TestUsersRepository()
    service = new AuthenticateService(repository)
    user = await repository.create({
      email: mockedEmail,
      name: 'john',
      password_hash: await hash(mockedPassword, 6),
    })
  })

  it('should be able to authenticate', async () => {
    const { user: authUser } = await service.authenticate({
      email: mockedEmail,
      password: mockedPassword,
    })

    expect(authUser.id).toBe(user.id)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(async () => {
      await service.authenticate({
        email: 'johndoe1@email.com',
        password: mockedPassword,
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsException)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await expect(async () => {
      await service.authenticate({
        email: mockedEmail,
        password: '12345679',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsException)
  })
})
