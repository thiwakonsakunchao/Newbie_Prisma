import jwt, { Secret } from 'jsonwebtoken'
import { Response, NextFunction } from 'express'

export const refreshTokenValidate = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.refreshToken) {
      console.log(req.body.refreshToken)
      return res.sendStatus(401).json()
    }

    const token = req.body.refreshToken
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      (err: any, decoded: any) => {
        if (err) {
          //   throw new Error(err.message)
          err = {
            message: err.message
          }
          return res.status(401).send(err)
        } else {
          req.user = decoded
          delete req.user.exp
          delete req.user.iat
          next()
        }
      }
    )
  } catch (error) {
    console.log(req.body.refreshToken)
    console.log(error)

    return res.sendStatus(403).json()
  }
}
