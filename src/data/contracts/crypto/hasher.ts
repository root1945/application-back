export interface Hasher {
  hash: (params: Hasher.Params) => Promise<Hasher.Result>
}

export namespace Hasher {
  export type Params = {
    value: string
  }

  export type Result = string
}
