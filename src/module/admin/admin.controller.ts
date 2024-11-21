import { Admin, Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { PrismaHelper } from '../../utils'
import { prisma } from '../../utils/prisma'
import { newAdmin } from './admin.logic'

const db = prisma.admin

const getQuery = (req: Request) => {
  const { name, email } = req.query
  const initQuery = <Prisma.AdminFindManyArgs>PrismaHelper.handleQuery(req)
  const query = PrismaHelper.initWhereQuery(initQuery, ['name', 'email'])
  if (name) {
    query.where.name = name as string
  }

  if (email) {
    query.where.email = email as string
  }
  return query
}

// export async function getAllAdmins(req: Request, res: Response) {
//   try {
//     const { name, email } = req.query
//     const where: Record<string, unknown> = {}

//     if (name) {
//       const adminName = {
//         contains: name as string,
//         mode: 'insensitive'
//       }
//       where.name = adminName
//     }
//     if (email) {
//       const adminEmail = {
//         contains: email as string,
//         mode: 'insensitive'
//       }
//       where.email = adminEmail
//     }
//     const admins = await prisma.admin.findMany({
//       where: where
//     })

//     if (!admins) {
//       res.status(404).json({ message: 'Not Found' })
//       return
//     }
//     res.status(200).json({ data: admins })
//   } catch (error) {
//     res.status(400).json({ message: 'error', error })
//   }
// }

export async function getAllAdmins(req: Request, res: Response) {
  try {
    const query = getQuery(req)
    const data = await db.findMany(query)
    res.status(200).json({ data })
  } catch (error) {
    console.debug('57 😙 => admin.controller.ts error =', error)
    res.status(400).json({ message: 'get fail', error })
  }
}

export async function getAdminById(req: Request, res: Response) {
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        id: req.params.id
      }
    })
    if (!admin) {
      res.status(404).json({ message: 'Not Found' })
      return
    }
    res.status(200).json({ data: admin })
  } catch (error) {
    res.status(400).json({ message: 'error', error })
  }
}

// export async function createAdmin(req: Request, res: Response) {
//   try {
//     if (Array.isArray(req.body)) {
//       await prisma.admin.createMany({
//         data: req.body
//       })
//       res.status(200).json({ message: 'admins Created' })
//     } else {
//       await prisma.admin.create({
//         data: {
//           ...req.body
//         }
//       })
//       res.status(200).json({ message: 'admin Created' })
//     }
//   } catch (error) {
//     res.status(400).json({ message: 'error', error })
//   }
// }

export async function createAdmin(req: Request, res: Response) {
  try {
    const data = await db.create({
      data: {
        ...newAdmin(req.body)
      }
    })

    res.status(200).json({ message: 'admin Created', data })
  } catch (error) {
    res.status(400).json({ message: 'create fail', error })
  }
}

// export async function updateAdmin(req: Request, res: Response) {
//   try {
//     const { id } = req.params

//     // const getAdmin = await PrismaHelper.getByIdPrisma<Admin>({
//     //   id: id,
//     //   key: 'id',
//     //   tableName: 'admin'
//     // })

//     const data = await db.update({
//       where: {
//         id: id
//       },
//       data: req.body
//     })
//     res.json({ data })
//   } catch (error) {
//     console.debug('57 😙 => admin.controller.ts error =', error)
//     res.status(400).json({ message: 'error', error })
//   }
// }
export async function updateAdmin(req: Request, res: Response) {
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        id: req.params.id
      }
    })
    if (!admin) {
      res.status(404).json({ message: 'Not Found' })
      return
    }
    await db.update({
      where: {
        id: req.params.id
      },
      data: {
        ...req.body
      }
    })
    res.status(200).json({ message: 'admin Updated' })
  } catch (error) {
    console.debug('57 😙 => admin.controller.ts error =', error)
    res.status(400).json({ message: 'error', error })
  }
}

export async function deleteAdmin(req: Request, res: Response) {
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        id: req.params.id
      }
    })
    if (!admin) {
      res.status(404).json({ message: 'Not Found' })
      return
    }
    await prisma.admin.delete({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json({ message: 'admin Deleted' })
  } catch (error) {
    res.status(400).json({ message: 'error', error })
  }
}
