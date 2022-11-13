import { RequiredFieldsValidation, CompareFieldsValidation, EmailValidation, Validator } from '@/application/validation'
import { EmailValidatorAdapter } from '@/utils'

export class ValidationBuilder {
  private constructor (
    private readonly value: any,
    private readonly fieldNames: string[] = [],
    private readonly fieldName: string = '',
    private readonly fieldNameToCompare: string = '',
    private readonly validations: Validator[] = []
  ) {}

  static of (params: { value: any, fieldName?: string, fieldNameToCompare?: string, fieldNames?: string[] }): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldNames, params.fieldName, params.fieldNameToCompare)
  }

  required (): ValidationBuilder {
    this.validations.push(new RequiredFieldsValidation(this.value, this.fieldNames))
    return this
  }

  compare (): ValidationBuilder {
    this.validations.push(new CompareFieldsValidation(this.value, this.fieldName, this.fieldNameToCompare))
    return this
  }

  isValidEmail (): ValidationBuilder {
    this.validations.push(new EmailValidation(this.value[this.fieldName], new EmailValidatorAdapter()))
    return this
  }

  build (): Validator[] {
    return this.validations
  }
}
