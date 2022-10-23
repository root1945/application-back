import bcrypt from 'bcryptjs'
import { Bcrypt } from '@/infra/crypto'

jest.mock('bcryptjs')

describe('Bcrypt', () => {
  let salt: number
  let fakeBcrypt: jest.Mocked<typeof bcrypt>
  let sut: Bcrypt

  beforeAll(() => {
    salt = 12
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
    fakeBcrypt.hash.mockImplementation(async () => await Promise.resolve('hashed_value'))
  })

  beforeEach(() => {
    sut = new Bcrypt(salt)
  })

  it('should call hash with correct values', async () => {
    await sut.hash({ value: 'any_value' })

    expect(fakeBcrypt.hash).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a hash on success', async () => {
    const hash = await sut.hash({ value: 'any_value' })

    expect(hash).toBe('hashed_value')
  })

  it('should throw if hash throws', async () => {
    fakeBcrypt.hash.mockImplementationOnce(async () => await Promise.reject(new Error()))

    const promise = sut.hash({ value: 'any_value' })

    await expect(promise).rejects.toThrow()
  })
})
