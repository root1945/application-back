import { Hasher, CompareHash } from '@/data/contracts/crypto'

import bcrypt from 'bcryptjs'

export class Bcrypt implements Hasher, CompareHash {
  constructor (
    private readonly salt: number
  ) {}

  async hash (params: Hasher.Params): Promise<Hasher.Result> {
    const hash = await bcrypt.hash(params.value, this.salt)
    return hash
  }

  async compare (params: CompareHash.Params): Promise<CompareHash.Result> {
    const isValid = await bcrypt.compare(params.value, params.hash)
    return isValid
  }
}
