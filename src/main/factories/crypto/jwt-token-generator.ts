import { JwtGenerateToken } from '@/infra/crypto'
import { env } from '@/main/config/env'

export const makeJwtTokenGenerator = (): JwtGenerateToken => {
  return new JwtGenerateToken(env.secret)
}
