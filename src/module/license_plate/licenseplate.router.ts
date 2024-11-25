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

export const licenseWithAccessSchema = z.object({
  licensePlate: z.object({
    first_name: z.string(),
    last_name: z.string(),
    license_number: z.string(),
    provinceId: z.string()
  }),
  accessHistory: z.array(
    z.object({ access_status: z.boolean(), image_source: z.string() })
  )
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
router.post(
  '/createLicenseWithAccess',
  validatorInput(licenseWithAccessSchema),
  licenseController.createLicensePlateWithAccess
)

export default router
