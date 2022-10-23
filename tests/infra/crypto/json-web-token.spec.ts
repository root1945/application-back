import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtGenerateToken {
  constructor (
    private readonly secret: string
  ) {}

  async generate (params: TokenGenerator.Params): Promise<void> {
    jwt.sign({ key: params.key }, this.secret, { expiresIn: params.expirationInMs })
  }
}

describe('JwtGenerateToken', () => {
  let secret: string
  let fakeJwt: jest.Mocked<typeof jwt>
  let sut: JwtGenerateToken

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtGenerateToken(secret)
  })

  it('should call sign with correct values', async () => {
    await sut.generate({ key: 'any_key', expirationInMs: 3600 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, secret, { expiresIn: 3600 })
  })
})
