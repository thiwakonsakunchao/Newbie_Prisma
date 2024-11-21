import { Request, Response, NextFunction } from 'express'

import _ from 'lodash'

import { z } from 'zod'

type Path = 'body' | 'query' | 'params'

export function validatorInput(schema: z.AnyZodObject, path: Path = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = _.get(req, path)
    const { error, value } = schema.parse(data)
    if (error) {
      res.status(404).json({ error: error?.details, code: 'validate-fail' })
      return
    }
    if (path === 'body') {
      req[path] = {
        ...req[path],
        ...(value as Record<string, unknown>)
      }
    }
    next()
  }
}
