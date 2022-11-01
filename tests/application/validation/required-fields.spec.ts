import { RequiredFieldsValidation } from '@/application/validation'
import { MissingParamError } from '@/application/errors'

describe('RequiredFieldsValidation', () => {
  it('should return MissingParamError if no value is provided', () => {
    const sut = new RequiredFieldsValidation(['any_field'])

    const error = sut.validate({})

    expect(error).toEqual(new MissingParamError('any_field'))
  })

  it('should return undefined if all required fields are provided', () => {
    const sut = new RequiredFieldsValidation(['any_field'])

    const error = sut.validate({ any_field: 'any_value' })

    expect(error).toBeUndefined()
  })
})
