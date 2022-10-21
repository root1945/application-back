import { AddAccountService } from '@/data/services'
import { LoadUserAccountRepository } from '@/data/contracts/repos'

import { mock } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'
import { AddAccount } from '@/domain/features'

describe('AddAccountService', () => {
  let sut: AddAccountService
  let loadUserAccountRepo: LoadUserAccountRepository
  let fakeAddAccount: AddAccount.Params

  beforeAll(() => {
    loadUserAccountRepo = mock()
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
})
