import { Bcrypt, JwtGenerateToken } from '@/infra/crypto'
import { env } from '@/main/config/env'

export const makeHasher = (): Bcrypt & JwtGenerateToken => {
  return Object.assign(new Bcrypt(12), new JwtGenerateToken(env.secret))
}
