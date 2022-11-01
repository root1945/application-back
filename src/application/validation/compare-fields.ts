import { InvalidParamError } from '@/application/errors'

export class CompareFieldsValidation {
  constructor (readonly field: string, readonly fieldToCompare: string) {}

  validate (input: any): Error | undefined {
    return input[this.field] !== input[this.fieldToCompare]
      ? new InvalidParamError(this.fieldToCompare)
      : undefined
  }
}
