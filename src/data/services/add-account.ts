import { AddAccount } from '@/domain/features'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { RegistrationError } from '@/domain/errors'

export class AddAccountService {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository
  ) {}

  async perform (params: AddAccount.Params): Promise<RegistrationError> {
    await this.userAccountRepo.load({ email: params.email })
    return new RegistrationError()
  }
}
