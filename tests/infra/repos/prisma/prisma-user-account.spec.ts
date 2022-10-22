import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { prismaMock } from '@/tests/infra/repos/prisma/helpers'
import prismaClient from './helpers/client'

class PrismaUserAccount {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const account = await prismaClient.user.findUnique({ where: { email: params.email } })
    if (account) return { id: account.id, name: account.name, email: account.email, password: account.password }
  }
}

describe('PrismaUserAccount', () => {
  describe('load', () => {
    let sut: PrismaUserAccount

    beforeEach(() => {
      sut = new PrismaUserAccount()
    })

    it('should return account if email exists', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password'
      })
    })

    it('should return undefined if email does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null)

      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })

    it('should rethrow if PrismaClient throws', async () => {
      prismaMock.user.findUnique.mockRejectedValueOnce(new Error('Prisma error'))

      const promise = sut.load({ email: 'any_email' })

      await expect(promise).rejects.toThrow(new Error('Prisma error'))
    })
  })
})
