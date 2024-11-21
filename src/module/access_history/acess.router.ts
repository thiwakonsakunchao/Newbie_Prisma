import { Router } from 'express'
import * as acccessController from './access.controller'
import { z } from 'zod'
import { validatorInput } from '../../middleware/validatorInput'

const router = Router()

export const accessSchema = z.object({
  access_status: z.boolean(),
  image_source: z.string(),
  LicenseId: z.string(),
})

router.get('/', acccessController.getAllAccess)
router.get('/:id', acccessController.getAccessById)
router.post('/create', validatorInput(accessSchema), acccessController.createAccess)
router.put('/update/:id', validatorInput(accessSchema), acccessController.updateAccess)
router.delete('/delete/:id', acccessController.deleteAccess)

export default router
