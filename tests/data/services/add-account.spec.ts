import { AddAccountService } from '@/data/services'
import { LoadUserAccountRepository, SaveUserAccountRepo } from '@/data/contracts/repos'
import { AddAccount } from '@/domain/features'
import { RegistrationError } from '@/domain/errors'
import { Hasher } from '@/data/contracts/crypto'

import { mock, MockProxy } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'

describe('AddAccountService', () => {
  let sut: AddAccountService
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveUserAccountRepo>
  let hasher: MockProxy<Hasher>
  let fakeAddAccount: AddAccount.Params

  beforeAll(() => {
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    hasher = mock()
    hasher.hash.mockResolvedValue('hashed_password')
    fakeAddAccount = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new AddAccountService(userAccountRepo, hasher)
  })

  it('should call LoadUserAccountRepo with correct params', async () => {
    await sut.perform(fakeAddAccount)

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: fakeAddAccount.email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should return RegistrationError if LoadUserAccountRepo returns an account', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })

    const result = await sut.perform(fakeAddAccount)

    expect(result).toEqual(new RegistrationError())
  })

  it('should call Hasher with correct params', async () => {
    await sut.perform(fakeAddAccount)

    expect(hasher.hash).toHaveBeenCalledWith({ value: fakeAddAccount.password })
    expect(hasher.hash).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserAccountRepo with correct params', async () => {
    await sut.perform(fakeAddAccount)

    expect(userAccountRepo.saveWithAccount).toHaveBeenCalledWith({
      name: fakeAddAccount.name,
      email: fakeAddAccount.email,
      password: 'hashed_password'
    })
    expect(userAccountRepo.saveWithAccount).toHaveBeenCalledTimes(1)
  })
})
