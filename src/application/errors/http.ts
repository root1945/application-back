export class ServerError extends Error {
  constructor (err?: Error) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = err?.stack
  }
}

export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}
