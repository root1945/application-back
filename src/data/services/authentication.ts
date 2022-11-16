import { Authentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { TokenGenerator, CompareHash } from '@/data/contracts/crypto'

export class AuthenticationService implements Authentication {
  constructor (
    private readonly userAccountRepo: LoadUserAccountRepository,
    private readonly hasher: CompareHash,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async perform (params: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.userAccountRepo.load({ email: params.email })
    if (!account) {
      return new AuthenticationError()
    }
    const isValid = await this.hasher.compare({ value: params.password, hash: account.password })
    if (!isValid) {
      return new AuthenticationError()
    }
    const accessToken = await this.tokenGenerator.generate({ key: account.id, expirationInMs: AccessToken.expirationInMs })
    return new AccessToken(accessToken)
  }
}
