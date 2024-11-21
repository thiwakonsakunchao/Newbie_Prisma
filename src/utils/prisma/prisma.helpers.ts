import { Request } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from './prisma.config'

import { Validator } from '../validator/validator'

export type PrismaModel = Prisma.ModelName
export type PrismaTable = Uncapitalize<PrismaModel>
const sorts = ['asc', 'desc'] as const
type Sort = (typeof sorts)[number]

type ObjectType = Record<string, unknown>
type OrderBy = {
  [key: string]: Sort
}

function isSort(checkType: string): checkType is Sort {
  return sorts.includes(checkType as Sort)
}

export type Query = {
  skip?: number
  take?: number
  where?: {
    created?: {
      lte?: Date
      gte?: Date
    }
    updated?: {
      lte?: Date
      gte?: Date
    }
  }
  cursor?: {
    id: number
  }
  orderBy?: OrderBy
}

export function handleQuery(req: Request): Query | object {
  const query: Query = {}
  const {
    limit,
    orderBy = 'desc',
    startAt,
    startCreate,
    endCreate,
    startUpdate,
    endUpdate
  } = req.query
  if (limit) {
    query.take = Number(limit)
  }

  if (startAt) {
    query.skip = Number(startAt)
  }

  if (Validator.isTimeStampISOString(startCreate as string)) {
    query.where = {
      created: {
        gte: new Date(startCreate as string)
      }
    }
  }

  if (Validator.isTimeStampISOString(endCreate as string)) {
    const oldData = query.where?.created || {}
    query.where = {
      created: {
        ...oldData,
        lte: new Date(endCreate as string)
      }
    }
  }

  if (Validator.isTimeStampISOString(startUpdate as string)) {
    query.where = {
      updated: {
        gte: new Date(startUpdate as string)
      }
    }
  }

  if (Validator.isTimeStampISOString(endUpdate as string)) {
    const oldData = query.where?.updated || {}
    query.where = {
      updated: {
        ...oldData,
        lte: new Date(endUpdate as string)
      }
    }
  }

  if (orderBy) {
    const filterOrderBy: OrderBy = {}
    if (Array.isArray(orderBy)) {
      if (orderBy.length % 2) {
        throw new Error('Filter orderBy invalid format.')
      }
      for (let index = 0, len = orderBy.length; index < len; index += 2) {
        filterOrderBy[orderBy[index] as string] = orderBy[index + 1] as Sort
      }
      query.orderBy = filterOrderBy
    } else {
      if (!isSort(orderBy as string)) {
        throw new Error('Please send value (asc | desc)')
      }
      query.orderBy = { updated: orderBy as Sort }
    }
  }

  return query
}

type GetTypeFromArrayString<T extends string[]> = {
  [P in T[number]]: ObjectType
}

export function initWhereQuery<T extends { where?: ObjectType }>(
  query: T = { where: {} } as T,
  fieldList: (keyof NonNullable<T['where']>)[] = []
) {
  if (!query.where) {
    query.where = {}
  }
  const fields = fieldList as string[]
  if (fieldList.length) {
    const value: GetTypeFromArrayString<typeof fields> = {}
    fields.forEach((d) => {
      value[d] = {}
    })
    query.where = {
      ...query.where,
      ...value
    }
  }
  return query as T & {
    where: GetTypeFromArrayString<typeof fields> | ObjectType
  }
}

export function getTable(tableName: PrismaTable) {
  const db = prisma[tableName]
  return db
}

export async function getByIdPrisma<T = any>({
  tableName,
  id,
  include,
  select,
  key = 'id'
}: {
  tableName: PrismaTable
  id: number | string
  include?: Record<string, unknown>
  select?: Record<string, unknown>
  key?: string
}) {
  const db = getTable(tableName)
  const query: Record<string, unknown> = {
    where: {
      [key]: id
    }
  }
  if (include && Object.keys(include).length) {
    query.include = include
  }
  if (select && Object.keys(select).length) {
    query.select = select
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  const result = await db.findUnique(query)
  if (!result) {
    throw new Error('NOT_FOUND_DATA')
  }
  return result as T
}
