import { RegistrationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'

export interface AddAccount {
  perform: (params: AddAccount.Params) => Promise<void>
}

export namespace AddAccount {
  export type Params = {
    name: string
    email: string
    password: string
  }

  export type Result = AccessToken | RegistrationError
}
