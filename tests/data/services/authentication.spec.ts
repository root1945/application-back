import { mock, MockProxy } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'

import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { Authentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

interface CompareHash {
  compare: (params: CompareHash.Params) => Promise<CompareHash.Result>
}

namespace CompareHash {
  export type Params = {
    value: string
    hash: string
  }
  export type Result = boolean
}

class AuthenticationService {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository,
    private readonly hasher: CompareHash
  ) {}

  async perform (params: Authentication.Params): Promise<AuthenticationError> {
    const user = await this.userAccountRepo.load({ email: params.email })
    if (user) {
      await this.hasher.compare({ value: params.password, hash: user.password })
    }
    return new AuthenticationError()
  }
}

describe('AuthenticationService', () => {
  let sut: AuthenticationService
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let compareHash: MockProxy<CompareHash>
  let email: string
  let password: string
  let hashedPassword: string

  beforeAll(() => {
    email = faker.internet.email()
    password = faker.internet.password()
    hashedPassword = faker.internet.password()
    loadUserAccountRepo = mock()
    loadUserAccountRepo.load.mockResolvedValue({
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      email,
      password: hashedPassword
    })
    compareHash = mock()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new AuthenticationService(loadUserAccountRepo, compareHash)
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

  it('should call compare with correct values', async () => {
    await sut.perform({ email, password })

    expect(compareHash.compare).toHaveBeenCalledWith({
      value: password,
      hash: hashedPassword
    })
    expect(compareHash.compare).toHaveBeenCalledTimes(1)
  })
})
