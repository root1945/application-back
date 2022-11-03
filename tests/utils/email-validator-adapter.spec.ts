import { EmailValidator } from '@/application/contracts'
import { faker } from '@faker-js/faker'
import validator from 'validator'

class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
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

  it('should returns true if validator returns true', () => {
    const isValid = sut.isValid(faker.internet.email())

    expect(isValid).toBe(true)
  })
})
