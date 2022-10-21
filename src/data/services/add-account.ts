import { AddAccount } from '@/domain/features'
import { LoadUserAccountRepository, SaveUserAccountRepo } from '@/data/contracts/repos'
import { RegistrationError } from '@/domain/errors'
import { Hasher } from '../contracts/crypto'

export class AddAccountService {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository,
    private readonly hasher: Hasher,
    private readonly saveUserAccountRepo: SaveUserAccountRepo
  ) {}

  async perform (params: AddAccount.Params): Promise<RegistrationError> {
    await this.userAccountRepo.load({ email: params.email })
    const hashedPassword = await this.hasher.hash({ value: params.password })
    await this.saveUserAccountRepo.save(Object.assign({}, params, { password: hashedPassword }))
    return new RegistrationError()
  }
}
