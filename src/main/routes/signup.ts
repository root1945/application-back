
import { Router } from 'express'

import { makeSignUpController } from '@/main/factories/controllers'
import { adaptExpressRoute } from '@/infra/http'

export default (router: Router): void => {
  const controller = makeSignUpController()
  router.post('/api/signup', adaptExpressRoute(controller))
}
