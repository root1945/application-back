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
  let email: string

  beforeEach(() => {
    email = faker.internet.email()
  })

  beforeAll(() => {
    sut = new EmailValidatorAdapter()
  })

  it('should returns false if validator returns false', () => {
    const isValid = sut.isValid('invalid_mail')

    expect(isValid).toBe(false)
  })

  it('should returns true if validator returns true', () => {
    const isValid = sut.isValid(email)

    expect(isValid).toBe(true)
  })

  it('should call validator with correct email', () => {
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid(email)

    expect(isEmailSpy).toHaveBeenCalledWith(email)
  })

  it('should throw if validator throws', () => {
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.isValid).toThrow()
  })
})
