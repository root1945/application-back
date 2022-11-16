import { AddAccountService } from '@/data/services'
import { makeBcrypt, makeJwtTokenGenerator } from '@/main/factories/crypto'
import { makePrismaUserAccount } from '@/main/factories/repos'

export const makeAddAccountService = (): AddAccountService => {
  return new AddAccountService(
    makePrismaUserAccount(),
    makeBcrypt(),
    makeJwtTokenGenerator()
  )
}
