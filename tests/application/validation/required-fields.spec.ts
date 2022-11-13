import { RequiredFieldsValidation } from '@/application/validation'
import { MissingParamError } from '@/application/errors'

describe('RequiredFieldsValidation', () => {
  it('should return MissingParamError if no value is provided', () => {
    const sut = new RequiredFieldsValidation({ name: 'any_name' }, ['name', 'email'])

    const error = sut.validate()

    expect(error).toEqual(new MissingParamError('email'))
  })

  it('should return undefined if all required fields are provided', () => {
    const sut = new RequiredFieldsValidation({ name: 'any_name', email: 'any_email' }, ['name', 'email'])

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
