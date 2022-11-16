import { mock, MockProxy } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'

import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { Authentication } from '@/domain/features'

class AuthenticationService {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository
  ) {}

  async perform (params: Authentication.Params): Promise<void> {
    await this.userAccountRepo.load({ email: params.email })
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
})
