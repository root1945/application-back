import { AddAccountService } from '@/data/services'
import { LoadUserAccountRepository, SaveUserAccountRepo } from '@/data/contracts/repos'
import { RegistrationError } from '@/domain/errors'
import { Hasher, TokenGenerator } from '@/data/contracts/crypto'
import { AccessToken } from '@/domain/models'

import { mock, MockProxy } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'

describe('AddAccountService', () => {
  let sut: AddAccountService
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveUserAccountRepo>
  let hasher: MockProxy<Hasher & TokenGenerator>
  let id: string
  let name: string
  let email: string
  let password: string

  beforeAll(() => {
    id = faker.datatype.uuid()
    name = faker.name.firstName()
    email = faker.internet.email()
    password = faker.internet.password()
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithAccount.mockResolvedValue({ id, name, email, password })
    hasher = mock()
    hasher.hash.mockResolvedValue('hashed_password')
    hasher.generate.mockResolvedValue('generated_token')
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new AddAccountService(userAccountRepo, hasher)
  })

  it('should call LoadUserAccountRepo with correct params', async () => {
    await sut.perform({ name, email, password })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should return RegistrationError if LoadUserAccountRepo returns an account', async () => {
    userAccountRepo.load.mockResolvedValueOnce({ id, name, email, password })

    const result = await sut.perform({ name, email, password })

    expect(result).toEqual(new RegistrationError())
  })

  it('should call Hasher with correct params', async () => {
    await sut.perform({ name, email, password })

    expect(hasher.hash).toHaveBeenCalledWith({ value: password })
    expect(hasher.hash).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserAccountRepo with correct params', async () => {
    await sut.perform({ name, email, password })

    expect(userAccountRepo.saveWithAccount).toHaveBeenCalledWith({ name, email, password: 'hashed_password' })
    expect(userAccountRepo.saveWithAccount).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ name, email, password })

    expect(hasher.generate).toHaveBeenCalledWith({ key: id, expirationInMs: 1800000 })
    expect(hasher.generate).toHaveBeenCalledTimes(1)
  })

  it('Should return accessToken on success', async () => {
    const result = await sut.perform({ name, email, password })

    expect(result).toEqual(new AccessToken('generated_token'))
  })

  it('Should rethrow if LoadUserAccountRepo throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('repo_error'))

    const promise = sut.perform({ name, email, password })

    await expect(promise).rejects.toThrow(new Error('repo_error'))
  })

  it('Should rethrow if Hasher throws', async () => {
    hasher.hash.mockRejectedValueOnce(new Error('hasher_error'))

    const promise = sut.perform({ name, email, password })

    await expect(promise).rejects.toThrow(new Error('hasher_error'))
  })
})
