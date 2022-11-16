import { Hasher } from '@/data/contracts/crypto'
import bcrypt from 'bcryptjs'

export class Bcrypt implements Hasher {
  constructor (
    private readonly salt: number
  ) {}

  async hash (params: Hasher.Params): Promise<Hasher.Result> {
    const hash = await bcrypt.hash(params.value, this.salt)
    return hash
  }
}
