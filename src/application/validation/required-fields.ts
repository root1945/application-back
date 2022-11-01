import { MissingParamError } from '@/application/errors'

export class RequiredFieldsValidation {
  constructor (private readonly fieldNames: string[]) {}

  validate (input: any): MissingParamError | undefined {
    for (const field of this.fieldNames) {
      if (!input[field]) {
        return new MissingParamError(field)
      }
    }
  }
}