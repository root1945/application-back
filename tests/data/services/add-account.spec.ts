import { AddAccountService } from '@/data/services'
import { LoadUserAccountRepository } from '@/data/contracts/repos'

import { mock, MockProxy } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'
import { AddAccount } from '@/domain/features'
import { RegistrationError } from '@/domain/errors'

describe('AddAccountService', () => {
  let sut: AddAccountService
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let fakeAddAccount: AddAccount.Params

  beforeAll(() => {
    loadUserAccountRepo = mock()
    loadUserAccountRepo.load.mockResolvedValue(undefined)
    fakeAddAccount = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  })

  beforeEach(() => {
    sut = new AddAccountService(loadUserAccountRepo)
  })

  it('should call LoadUserAccountRepo with correct params', async () => {
    await sut.perform(fakeAddAccount)

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: fakeAddAccount.email })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should return RegistrationError if LoadUserAccountRepo returns an account', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce({
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })

    const result = await sut.perform(fakeAddAccount)

    expect(result).toEqual(new RegistrationError())
  })
})
