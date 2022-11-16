export interface CompareHash {
  compare: (params: CompareHash.Params) => Promise<CompareHash.Result>
}

export namespace CompareHash {
  export type Params = {
    value: string
    hash: string
  }
  export type Result = boolean
}
