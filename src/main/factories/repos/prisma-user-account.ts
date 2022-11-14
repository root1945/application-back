import { PrismaUserAccount } from '@/infra/repos/prisma'

export const makePrismaUserAccount = (): PrismaUserAccount => {
  return new PrismaUserAccount()
}
