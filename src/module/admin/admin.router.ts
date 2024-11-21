import { Router } from 'express'
import * as adminController from './admin.controller'
import { z } from 'zod'
import { validatorInput } from '../../middleware/validatorInput'
import { PermissionFeature } from '@prisma/client'

const router = Router()

export const adminSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  profilePic: z.string().optional(),
  phone: z.string().optional(),
  permissions: z.array(
    z.object({
      feature: z.string(),
      show: z.boolean(),
      permissionFeature: z.nativeEnum(PermissionFeature)
    })
  )
})

router.get('/', adminController.getAllAdmins)
router.get('/:id', adminController.getAdminById)
router.post('/', validatorInput(adminSchema), adminController.createAdmin)
router.put('/:id', validatorInput(adminSchema), adminController.updateAdmin)
router.delete('/:id', adminController.deleteAdmin)

export default router
