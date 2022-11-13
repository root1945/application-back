import { RequiredFieldsValidation, CompareFieldsValidation, EmailValidation, ValidationBuilder } from '@/application/validation'
import { EmailValidatorAdapter } from '@/utils'

import { faker } from '@faker-js/faker'

describe('ValidationBuilder', () => {
  let email: string

  beforeAll(() => {
    email = faker.internet.email()
  })

  it('should return RequiredFieldsValidation', () => {
    const input = { name: faker.name.firstName(), email, password: faker.internet.password(), passwordConfirmation: faker.internet.password() }
    const validations = ValidationBuilder
      .of({ value: input, fieldNames: ['name', 'email', 'password', 'passwordConfirmation'] })
      .required()
      .build()

    expect(validations).toEqual([new RequiredFieldsValidation(input, ['name', 'email', 'password', 'passwordConfirmation'])])
  })

  it('should return CompareFieldsValidation', () => {
    const input = { password: faker.internet.password(), passwordConfirmation: faker.internet.password() }
    const validations = ValidationBuilder
      .of({ value: input, fieldName: 'password', fieldNameToCompare: 'passwordConfirmation' })
      .compare()
      .build()

    expect(validations).toEqual([new CompareFieldsValidation(input, 'password', 'passwordConfirmation')])
  })

  it('should return EmailValidation', () => {
    const input = { email }
    const validations = ValidationBuilder
      .of({ value: input, fieldName: 'email' })
      .isValidEmail()
      .build()

    expect(validations).toEqual([new EmailValidation(input.email, new EmailValidatorAdapter())])
  })
})
