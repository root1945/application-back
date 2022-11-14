import { SignupController } from '@/application/controllers'
import { makeAddAccountService } from '@/main/factories/services'

export const makeSignUpController = (): SignupController => {
  const addAccountService = makeAddAccountService()
  return new SignupController(addAccountService)
}
