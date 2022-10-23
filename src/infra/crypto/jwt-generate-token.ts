import { TokenGenerator } from '@/data/contracts/crypto'
import { sign } from 'jsonwebtoken'

export class JwtGenerateToken implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generate (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const token = sign({ key: params.key }, this.secret, { expiresIn: params.expirationInMs })
    return token
  }
}
