export interface AddAccount {
  perform: (params: AddAccount.Params) => Promise<void>
}

export namespace AddAccount {
  export type Params = {
    name: string
    email: string
    password: string
  }
}
