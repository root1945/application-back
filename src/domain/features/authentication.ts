import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'

export interface Authentication {
  perform: (params: Authentication.Params) => Promise<Authentication.Result>
}

export namespace Authentication {
  export type Params = {
    email: string
    password: string
  }

  export type Result = AccessToken | AuthenticationError
}
