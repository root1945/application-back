import { AddAccountService } from '@/data/services'
import { makeHasher } from '@/main/factories/crypto'
import { makePrismaUserAccount } from '@/main/factories/repos'

export const makeAddAccountService = (): AddAccountService => {
  return new AddAccountService(
    makePrismaUserAccount(),
    makeHasher()
  )
}
