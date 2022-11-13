import { EmailValidator } from '@/application/contracts'
import { InvalidParamError } from '@/application/errors'
import { EmailValidation } from '@/application/validation'

import { mock, MockProxy } from 'jest-mock-extended'

describe('EmailValidation', () => {
  let emailValidator: MockProxy<EmailValidator>
  let sut: EmailValidation

  beforeAll(() => {
    emailValidator = mock()
    emailValidator.isValid.mockReturnValue(true)
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

  it('should return undefined if EmailValidator returns true', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
