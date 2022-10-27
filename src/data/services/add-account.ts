import { AddAccount } from '@/domain/features'
import { LoadUserAccountRepository, SaveUserAccountRepo } from '@/data/contracts/repos'
import { RegistrationError } from '@/domain/errors'
import { Hasher, TokenGenerator } from '@/data/contracts/crypto'
import { AccessToken } from '@/domain/models'

export class AddAccountService implements AddAccount {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository & SaveUserAccountRepo,
    private readonly hasher: Hasher & TokenGenerator
  ) {}

  async perform (params: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.userAccountRepo.load({ email: params.email })
    if (account) {
      return new RegistrationError()
    }
    const hashedPassword = await this.hasher.hash({ value: params.password })
    const userAccount = await this.userAccountRepo.saveWithAccount({
      name: params.name,
      email: params.email,
      password: hashedPassword
    })
    const accessToken = await this.hasher.generate({ key: userAccount.id, expirationInMs: AccessToken.expirationInMs })
    return new AccessToken(accessToken)
  }
}
