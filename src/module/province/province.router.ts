import { Router } from 'express'
import * as provinceController from './province.controller'
import { z } from 'zod'
import { validatorInput } from '../../middleware/validatorInput'
import accessTokenValidate from '../../middleware/accessTokenValidate'

const router = Router()

export const provinceSchema = z.object({
  province: z.string()
})

router.get('/', provinceController.getAllProvince)
router.get('/:id', provinceController.getProvinceById)
router.post(
  '/create',
  accessTokenValidate,
  validatorInput(provinceSchema),
  provinceController.createProvince
)
router.put(
  '/update/:id',
  accessTokenValidate,
  validatorInput(provinceSchema),
  provinceController.updateProvince
)
router.delete('/delete/:id', provinceController.deleteProvince)

export default router
