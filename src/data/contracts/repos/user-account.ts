export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name: string
    email: string
    password: string
  }
}

export interface SaveUserAccountRepo {
  save: (params: SaveUserAccountRepo.Params) => Promise<SaveUserAccountRepo.Result>
}

export namespace SaveUserAccountRepo {
  export type Params = {
    name: string
    email: string
    password: string
  }

  export type Result = {
    id: string
    name: string
    email: string
    password: string
  }
}
