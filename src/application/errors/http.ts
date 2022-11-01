export class ServerError extends Error {
  constructor (err?: Error) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = err?.stack
  }
}
