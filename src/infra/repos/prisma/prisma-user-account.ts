import { LoadUserAccountRepository, SaveUserAccountRepo } from '@/data/contracts/repos'
import prismaClient from '@/infra/repos/prisma/helpers/client'

export class PrismaUserAccount implements LoadUserAccountRepository, SaveUserAccountRepo {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const account = await prismaClient.user.findUnique({ where: { email: params.email } })
    if (account) return { id: account.id, name: account.name, email: account.email, password: account.password }
  }

  async saveWithAccount (params: SaveUserAccountRepo.Params): Promise<SaveUserAccountRepo.Result> {
    const account = await prismaClient.user.create({ data: { ...params } })
    return { id: account.id, name: account.name, email: account.email, password: account.password }
  }
}
