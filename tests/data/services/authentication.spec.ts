import { mock, MockProxy } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'

import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { Authentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { TokenGenerator } from '@/data/contracts/crypto'
import { AccessToken } from '@/domain/models'

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
    private readonly hasher: CompareHash,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async perform (params: Authentication.Params): Promise<AuthenticationError> {
    const user = await this.userAccountRepo.load({ email: params.email })
    if (user) {
      const isValid = await this.hasher.compare({ value: params.password, hash: user.password })
      if (isValid) {
        await this.tokenGenerator.generate({ key: user.id, expirationInMs: AccessToken.expirationInMs })
      }
    }
    return new AuthenticationError()
  }
}

describe('AuthenticationService', () => {
  let sut: AuthenticationService
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let compareHash: MockProxy<CompareHash>
  let tokenGenerator: MockProxy<TokenGenerator>
  let id: string
  let email: string
  let password: string
  let hashedPassword: string

  beforeAll(() => {
    id = faker.datatype.uuid()
    email = faker.internet.email()
    password = faker.internet.password()
    hashedPassword = faker.internet.password()
    loadUserAccountRepo = mock()
    loadUserAccountRepo.load.mockResolvedValue({
      id,
      name: faker.name.firstName(),
      email,
      password: hashedPassword
    })
    compareHash = mock()
    compareHash.compare.mockResolvedValue(true)
    tokenGenerator = mock()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new AuthenticationService(loadUserAccountRepo, compareHash, tokenGenerator)
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

  it('should return AuthenticationError if compare returns false', async () => {
    compareHash.compare.mockResolvedValueOnce(false)

    const error = await sut.perform({ email, password }).catch(error => error)

    expect(error).toEqual(new AuthenticationError())
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ email, password })

    expect(tokenGenerator.generate).toHaveBeenCalledWith({ key: id, expirationInMs: 1800000 })
    expect(tokenGenerator.generate).toHaveBeenCalledTimes(1)
  })
})
