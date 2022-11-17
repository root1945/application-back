import { AuthenticationController } from '@/application/controllers'
import { makeAuthenticationService } from '@/main/factories/services'

export const makeAuthenticationController = (): AuthenticationController => {
  const authenticationService = makeAuthenticationService()
  return new AuthenticationController(authenticationService)
}
