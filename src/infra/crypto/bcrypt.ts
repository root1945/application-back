import { Hasher, CompareHash } from '@/data/contracts/crypto'

import bcrypt from 'bcryptjs'

export class Bcrypt implements Hasher {
  constructor (
    private readonly salt: number
  ) {}

  async hash (params: Hasher.Params): Promise<Hasher.Result> {
    const hash = await bcrypt.hash(params.value, this.salt)
    return hash
  }

  async compare (params: CompareHash.Params): Promise<void> {
    await bcrypt.compare(params.value, params.hash)
  }
}
