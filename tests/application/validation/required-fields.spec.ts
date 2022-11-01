
class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}

class RequiredFields {
  constructor (private readonly fieldNames: string[]) {}

  validate (input: any): MissingParamError | undefined {
    for (const field of this.fieldNames) {
      if (!input[field]) {
        return new MissingParamError(field)
      }
    }
  }
}

describe('RequiredFields', () => {
  it('should return MissingParamError if no value is provided', () => {
    const sut = new RequiredFields(['any_field'])

    const error = sut.validate({})

    expect(error).toEqual(new MissingParamError('any_field'))
  })

  it('should return undefined if all required fields are provided', () => {
    const sut = new RequiredFields(['any_field'])

    const error = sut.validate({ any_field: 'any_value' })

    expect(error).toBeUndefined()
  })
})
