import { LoadUserAccountRepository } from '@/data/contracts/repos'
import prismaClient from '@/infra/repos/prisma/helpers/client'

export class PrismaUserAccount {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const account = await prismaClient.user.findUnique({ where: { email: params.email } })
    if (account) return { id: account.id, name: account.name, email: account.email, password: account.password }
  }
}
