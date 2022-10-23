import { prismaMock } from '@/tests/infra/repos/prisma/helpers'
import { PrismaUserAccount } from '@/infra/repos/prisma'

describe('PrismaUserAccount', () => {
  let sut: PrismaUserAccount

  beforeEach(() => {
    sut = new PrismaUserAccount()
  })

  describe('load', () => {
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

  describe('saveWithAccount', () => {
    it('should return an account on success', async () => {
      prismaMock.user.create.mockResolvedValueOnce({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const account = await sut.saveWithAccount({
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password'
      })

      expect(account).toEqual({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password'
      })
    })
  })
})
