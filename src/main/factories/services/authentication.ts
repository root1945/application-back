import { AuthenticationService } from '@/data/services'
import { makeBcrypt, makeJwtTokenGenerator } from '@/main/factories/crypto'
import { makePrismaUserAccount } from '@/main/factories/repos'

export const makeAuthenticationService = (): AuthenticationService => {
  const userAccountRepo = makePrismaUserAccount()
  const bcrypt = makeBcrypt()
  const jwtTokenGenerator = makeJwtTokenGenerator()

  return new AuthenticationService(userAccountRepo, bcrypt, jwtTokenGenerator)
}
