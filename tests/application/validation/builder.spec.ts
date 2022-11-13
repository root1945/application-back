import { RequiredFieldsValidation, Validator, CompareFieldsValidation, EmailValidation } from '@/application/validation'
import { EmailValidatorAdapter } from '@/utils'

import { faker } from '@faker-js/faker'

class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly validations: Validator[] = []
  ) {}

  static of (params: { value: any }): ValidationBuilder {
    return new ValidationBuilder(params.value)
  }

  required (fieldNames: string[]): ValidationBuilder {
    this.validations.push(new RequiredFieldsValidation(this.value, fieldNames))
    return this
  }

  compare (fieldName: string, fieldNameToCompare: string): ValidationBuilder {
    this.validations.push(new CompareFieldsValidation(this.value, fieldName, fieldNameToCompare))
    return this
  }

  isValidEmail (fieldName: string): ValidationBuilder {
    this.validations.push(new EmailValidation(this.value[fieldName], new EmailValidatorAdapter()))
    return this
  }

  build (): Validator[] {
    return this.validations
  }
}

describe('ValidationBuilder', () => {
  let email: string

  beforeAll(() => {
    email = faker.internet.email()
  })

  it('should return RequiredFieldsValidation', () => {
    const validators = ValidationBuilder
      .of({
        value: {
          any_field: 'any_value'
        }
      })
      .required(['any_field'])
      .build()

    expect(validators).toEqual([new RequiredFieldsValidation({ any_field: 'any_value' }, ['any_field'])])
  })

  it('should return CompareFieldsValidation', () => {
    const validators = ValidationBuilder
      .of({
        value: {
          field: 'any_value',
          fieldToCompare: 'any_value'
        }
      })
      .compare('field', 'fieldToCompare')
      .build()

    expect(validators).toEqual([new CompareFieldsValidation({ field: 'any_value', fieldToCompare: 'any_value' }, 'field', 'fieldToCompare')])
  })

  it('should return EmailValidation', () => {
    const validators = ValidationBuilder
      .of({ value: { email } })
      .isValidEmail('email')
      .build()

    expect(validators).toEqual([new EmailValidation(email, new EmailValidatorAdapter())])
  })
})
