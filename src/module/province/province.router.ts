import { Router } from 'express'
import * as provinceController from './province.controller'
import { z } from 'zod'
import { validatorInput } from '../../middleware/validatorInput'

const router = Router()

export const provinceSchema = z.object({
    province: z.string()
  })

router.get('/', provinceController.getAllProvince)
router.get('/:id', provinceController.getProvinceById)
router.post('/create', validatorInput(provinceSchema), provinceController.createProvince)
router.put('/update/:id', validatorInput(provinceSchema), provinceController.updateProvince)
router.delete('/delete/:id', provinceController.deleteProvince)



export default router
