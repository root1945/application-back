import { Request, Response } from 'express'

import { Controller } from '@/application/controllers'

export class ExpressRouter {
  constructor (private readonly controller: Controller) {}

  async adapt (req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body })
    httpResponse.statusCode === 200
      ? res.status(httpResponse.statusCode).json(httpResponse.data)
      : res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
  }
}
