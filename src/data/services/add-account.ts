import { AddAccount } from '@/domain/features'
import { LoadUserAccountRepository, SaveUserAccountRepo } from '@/data/contracts/repos'
import { RegistrationError } from '@/domain/errors'
import { Hasher, TokenGenerator } from '@/data/contracts/crypto'
import { AccessToken } from '@/domain/models'

export class AddAccountService {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository & SaveUserAccountRepo,
    private readonly hasher: Hasher & TokenGenerator
  ) {}

  async perform (params: AddAccount.Params): Promise<RegistrationError> {
    await this.userAccountRepo.load({ email: params.email })
    const hashedPassword = await this.hasher.hash({ value: params.password })
    const account = await this.userAccountRepo.saveWithAccount(Object.assign({}, params, { password: hashedPassword }))
    await this.hasher.generate({ key: account.id, expirationInMs: AccessToken.expirationInMs })
    return new RegistrationError()
  }
}
