import { AddAccount } from '@/domain/features'
import { LoadUserAccountRepository } from '@/data/contracts/repos'

export class AddAccountService {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository
  ) {}

  async perform (params: AddAccount.Params): Promise<void> {
    await this.userAccountRepo.load({ email: params.email })
  }
}
