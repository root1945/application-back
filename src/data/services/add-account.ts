import { AddAccount } from '@/domain/features'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { RegistrationError } from '@/domain/errors'
import { Hasher } from '../contracts/crypto'

export class AddAccountService {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository,
    private readonly hasher: Hasher
  ) {}

  async perform (params: AddAccount.Params): Promise<RegistrationError> {
    await this.userAccountRepo.load({ email: params.email })
    await this.hasher.hash({ value: params.password })
    return new RegistrationError()
  }
}
