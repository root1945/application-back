
import { Router } from 'express'

import { makeAuthenticationController } from '@/main/factories/controllers'
import { adaptExpressRoute } from '@/infra/http'

export default (router: Router): void => {
  const controller = makeAuthenticationController()
  router.post('/api/account/login', adaptExpressRoute(controller))
}
