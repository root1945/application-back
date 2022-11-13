import { EmailValidator } from '@/application/contracts'

import { mock, MockProxy } from 'jest-mock-extended'

class EmailValidation {
  constructor (
    private readonly value: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (): void {
    this.emailValidator.isValid(this.value)
  }
}

describe('EmailValidation', () => {
  let emailValidator: MockProxy<EmailValidator>
  let sut: EmailValidation

  beforeAll(() => {
    emailValidator = mock()
  })

  beforeEach(() => {
    sut = new EmailValidation('any_email', emailValidator)
  })

  it('should call EmailValidator with correct email', () => {
    sut.validate()

    expect(emailValidator.isValid).toHaveBeenCalledWith('any_email')
    expect(emailValidator.isValid).toHaveBeenCalledTimes(1)
  })
})
