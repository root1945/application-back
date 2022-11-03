import { EmailValidator } from '@/application/contracts'

class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return false
  }
}

describe('EmailValidatorAdapter', () => {
  let sut: EmailValidatorAdapter

  beforeAll(() => {
    sut = new EmailValidatorAdapter()
  })

  it('should returns false if validator returns false', () => {
    const isValid = sut.isValid('invalid_mail')

    expect(isValid).toBe(false)
  })
})
