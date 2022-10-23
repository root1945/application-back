import jwt from 'jsonwebtoken'
import { JwtGenerateToken } from '@/infra/crypto'

jest.mock('jsonwebtoken')

describe('JwtGenerateToken', () => {
  let secret: string
  let fakeJwt: jest.Mocked<typeof jwt>
  let sut: JwtGenerateToken

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    sut = new JwtGenerateToken(secret)
  })

  it('should call sign with correct values', async () => {
    await sut.generate({ key: 'any_key', expirationInMs: 3600 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, secret, { expiresIn: 3600 })
  })

  it('should return a token on sign success', async () => {
    const token = await sut.generate({ key: 'any_key', expirationInMs: 3600 })

    expect(token).toEqual('any_token')
  })

  it('should rethrow if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('sign_error') })

    const promise = sut.generate({ key: 'any_key', expirationInMs: 3600 })

    await expect(promise).rejects.toThrow(new Error('sign_error'))
  })
})
