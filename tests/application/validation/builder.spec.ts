import { RequiredFieldsValidation, Validator } from '@/application/validation'

class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldNames: string[],
    private readonly validations: Validator[] = []
  ) {}

  static of (params: { value: any, fieldNames: string[] }): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldNames)
  }

  required (): ValidationBuilder {
    this.validations.push(new RequiredFieldsValidation(this.value, this.fieldNames))
    return this
  }

  build (): Validator[] {
    return this.validations
  }
}

describe('ValidationBuilder', () => {
  it('should return RequiredFieldsValidation', () => {
    const validators = ValidationBuilder
      .of({
        value: {
          any_field: 'any_value'
        },
        fieldNames: ['any_field']
      })
      .required()
      .build()

    expect(validators).toEqual([new RequiredFieldsValidation({ any_field: 'any_value' }, ['any_field'])])
  })
})
