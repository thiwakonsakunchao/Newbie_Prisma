import { PermissionFeature } from '@prisma/client'
import { z } from 'zod'
import { adminSchema } from './admin.router'

type adminScheme = z.infer<typeof adminSchema>

export function newAdmin(data: adminScheme): adminScheme {
  return adminSchema.parse(data)
}
