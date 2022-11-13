import { EmailValidator } from '@/application/contracts'

import { mock, MockProxy } from 'jest-mock-extended'
import { InvalidParamError } from '@/application/errors'

class EmailValidation {
  constructor (
    private readonly value: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (): Error | undefined {
    if (!this.emailValidator.isValid(this.value)) {
      return new InvalidParamError('email')
    }
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

  it('should return error if EmailValidator returns false', () => {
    emailValidator.isValid.mockReturnValueOnce(false)

    const error = sut.validate()

    expect(error).toEqual(new InvalidParamError('email'))
  })
})
