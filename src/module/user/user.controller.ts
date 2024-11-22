import { User, Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { PrismaHelper } from '../../utils'
import { prisma } from '../../utils/prisma'
import { log } from 'console'
import bcrypt from 'bcrypt'
import { has } from 'lodash'
import { generateTokens } from '../../utils/genToken'
import jwt, { Secret } from 'jsonwebtoken'

const db = prisma.user

export const getAllUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await db.findMany()
    res.status(200).json({
      message: 'Okay La',
      data: {
        data
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error Na',
      error
    })
  }
}

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params

  try {
    const data = await db.findUnique({
      where: {
        id: id
      }
    })
    if (!data) {
      res.status(404).json({
        message: 'User Not Found'
      })
      return
    }

    res.status(200).json({
      message: 'Okay La',
      data: {
        data
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error Na',
      error
    })
  }
}

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const data = await db.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    res.status(200).json({
      message: 'create La',
      data
    })
  } catch (error) {
    console.log(req.body)

    res.status(500).json({
      message: 'Error Na',
      error
    })
  }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body

  try {
    const data = await db.findUnique({
      where: {
        username: username
      }
    })

    if (data && (await bcrypt.compare(password, data.password))) {
      const tokens = generateTokens(data)

      const newToken = await db.update({
        where: {
          id: data.id
        },
        data: {
          refreshtoken: tokens.refreshToken
        }
      })

      res.status(200).json({
        message: 'login La',
        newToken,
        accesstoken: tokens.accessToken
      })
    }
  } catch (error) {
    console.error('Detailed Error:', error)
    res.status(500).json({
      message: 'Error Na',
      error: error
    })
  }
}

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params
  const { username, password } = req.body

  try {
    const data = await db.findUnique({
      where: {
        id: id
      }
    })

    if (!data) {
      res.status(404).json({
        message: 'Not Found'
      })
      return
    }

    const newDate = await db.update({
      where: {
        id: id
      },
      data: {
        username,
        password
      }
    })
    res.status(200).json({
      message: 'Update La',
      newDate
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error Na',
      error
    })
  }
}

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params

  try {
    const data = await db.findUnique({
      where: {
        id: id
      }
    })
    if (!data) {
      res.status(404).json({
        message: 'Not Found'
      })
      return
    }

    const deletedData = await db.delete({
      where: {
        id: id
      }
    })
    res.status(200).json({
      message: 'Delete La',
      deletedData
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error Na',
      error
    })
  }
}

export const refreshToken = async (req: any, res: Response): Promise<void> => {
  try {
    const username = req.user.username
    let newToken
    const oldUser = await db.findUnique({
      where: {
        username: username
      }
    })

    const oldRefreshToken = oldUser?.refreshtoken
    const refreshTokenFromBody = req.body.refreshToken

    console.log('Old Refresh Token = ' + oldRefreshToken)
    console.log('refresh token from request = ' + refreshTokenFromBody)

    if (oldRefreshToken?.toString() !== refreshTokenFromBody.toString()) {
      res.status(401).json({
        message: 'Refresh Token Not Same Na'
      })
      return
    }

    const isValidRefreshToken = jwt.verify(
      String(oldRefreshToken),
      process.env.REFRESH_TOKEN_SECRET as Secret
    ) as jwt.JwtPayload

    if (!isValidRefreshToken) {
      console.log('aaaa')

      res.sendStatus(401)
      return
    }

    if (oldUser) {
      const token = generateTokens(oldUser)
      newToken = token
    }

    console.log('New Refresh Token: ' + newToken)

    await db.update({
      where: {
        id: oldUser?.id
      },
      data: {
        refreshtoken: newToken?.refreshToken
      }
    })

    res.status(200).json({
      message: 'Refresh Token La',
      username: oldUser?.username,
      accesstoken: newToken?.accessToken,
      refreshtoken: newToken?.refreshToken
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error Na',
      error
    })
  }
}
