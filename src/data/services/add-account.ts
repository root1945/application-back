import { AddAccount } from '@/domain/features'
import { LoadUserAccountRepository, SaveUserAccountRepo } from '@/data/contracts/repos'
import { RegistrationError } from '@/domain/errors'
import { Hasher } from '../contracts/crypto'

export class AddAccountService {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository & SaveUserAccountRepo,
    private readonly hasher: Hasher
  ) {}

  async perform (params: AddAccount.Params): Promise<RegistrationError> {
    await this.userAccountRepo.load({ email: params.email })
    const hashedPassword = await this.hasher.hash({ value: params.password })
    await this.userAccountRepo.saveWithAccount(Object.assign({}, params, { password: hashedPassword }))
    return new RegistrationError()
  }
}
