import { mock, MockProxy } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'

import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { Authentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

class AuthenticationService {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository
  ) {}

  async perform (params: Authentication.Params): Promise<AuthenticationError> {
    await this.userAccountRepo.load({ email: params.email })
    return new AuthenticationError()
  }
}

describe('AuthenticationService', () => {
  let sut: AuthenticationService
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let email: string
  let password: string

  beforeAll(() => {
    email = faker.internet.email()
    password = faker.internet.password()
    loadUserAccountRepo = mock()
  })

  beforeEach(() => {
    sut = new AuthenticationService(loadUserAccountRepo)
  })

  it('should call LoadUserAccountRepo with correct values', async () => {
    await sut.perform({ email, password })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError if LoadUserAccountRepo returns undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)

    const error = await sut.perform({ email, password }).catch(error => error)

    expect(error).toEqual(new AuthenticationError())
  })
})
