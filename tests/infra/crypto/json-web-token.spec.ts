import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtGenerateToken implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generate (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const token = jwt.sign({ key: params.key }, this.secret, { expiresIn: params.expirationInMs })
    return token
  }
}

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
})
