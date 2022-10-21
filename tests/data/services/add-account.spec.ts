import { AddAccountService } from '@/data/services'
import { LoadUserAccountRepository } from '@/data/contracts/repos'

import { mock } from 'jest-mock-extended'

describe('AddAccountService', () => {
  let sut: AddAccountService
  let loadUserAccountRepo: LoadUserAccountRepository

  beforeAll(() => {
    loadUserAccountRepo = mock()
  })

  beforeEach(() => {
    sut = new AddAccountService(loadUserAccountRepo)
  })

  it('should call LoadUserAccountRepo with correct params', async () => {
    await sut.perform({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
})
