import { RequiredFieldsValidation, CompareFieldsValidation, EmailValidation, Validator } from '@/application/validation'
import { EmailValidatorAdapter } from '@/utils'

export class ValidationBuilder {
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
