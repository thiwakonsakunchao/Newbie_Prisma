import { Router } from 'express'
import * as licenseController from './licenseplate.controller'
import { z } from 'zod'
import { validatorInput } from '../../middleware/validatorInput'
import accessTokenValidate from '../../middleware/accessTokenValidate'

const router = Router()

export const licenseSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  license_number: z.string(),
  provinceId: z.string()
})

router.get('/', licenseController.getAllLicense)
router.get('/:id', licenseController.getLicenseById)
router.post(
  '/create',
  validatorInput(licenseSchema),
  accessTokenValidate,
  licenseController.createLicense
)
router.put(
  '/update/:id',
  accessTokenValidate,
  validatorInput(licenseSchema),
  licenseController.updateLicense
)
router.delete(
  '/delete/:id',
  accessTokenValidate,
  licenseController.deleteLicense
)

export default router
