export class RegistrationError extends Error {
  constructor () {
    super('Registration failed')
    this.name = 'RegistrationError'
  }
}
