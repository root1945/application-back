import { Bcrypt } from '@/infra/crypto'
import { env } from '@/main/config/env'

export const makeBcrypt = (): Bcrypt => {
  return new Bcrypt(+env.salt)
}
