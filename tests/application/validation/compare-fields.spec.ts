import { InvalidParamError } from '@/application/errors'
import { CompareFieldsValidation } from '@/application/validation'

describe('CompareFieldsValidation', () => {
  it('should return InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')

    const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' })

    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('should return undefined if validation succeeds', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')

    const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })

    expect(error).toBeUndefined()
  })
})
