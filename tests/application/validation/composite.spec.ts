import { mock, MockProxy } from 'jest-mock-extended'

interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite {
  constructor (private readonly validators: Validator[]) {}

  validate (): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate()
      if (error) {
        return error
      }
    }
  }
}

describe('ValidationComposite', () => {
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator[]
  let sut: ValidationComposite

  beforeAll(() => {
    validator1 = mock()
    validator1.validate.mockReturnValue(undefined)
    validator2 = mock()
    validator2.validate.mockReturnValue(undefined)
    validators = [validator1, validator2]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })

  it('should return undefined if all validations return undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return the first error if more than one validation fails', () => {
    const error1 = new Error('error1')
    validator1.validate.mockReturnValueOnce(error1)
    const error2 = new Error('error2')
    validator2.validate.mockReturnValueOnce(error2)

    const error = sut.validate()

    expect(error).toBe(error1)
  })

  it('should return the error', () => {
    const error = new Error('error')
    validator1.validate.mockReturnValueOnce(error)

    const result = sut.validate()

    expect(result).toBe(error)
  })
})
