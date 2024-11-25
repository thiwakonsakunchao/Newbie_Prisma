import { Router } from 'express'
import * as detectionController from './detection.controller'
import { z } from 'zod'
import { validatorInput } from '../../middleware/validatorInput'
import accessTokenValidate from '../../middleware/accessTokenValidate'

const router = Router()

export const detectionSchema = z.object({
  number_car: z.number(),
  number_empty: z.number(),
  image_source: z.string()
})

export const manyDetectionSchema = z.array(
  z.object({
    number_car: z.number(),
    number_empty: z.number(),
    image_source: z.string()
  })
)

router.get('/', detectionController.getAllDetection)
router.get('/:id', detectionController.getDetectionById)
router.post(
  '/create',
  accessTokenValidate,
  validatorInput(detectionSchema),
  detectionController.createDetection
)
router.put(
  '/update/:id',
  accessTokenValidate,
  validatorInput(detectionSchema),
  detectionController.updateDetection
)
router.delete('/delete/:id', detectionController.deleteDetection)
router.post(
  '/manyCreate',
  accessTokenValidate,
  validatorInput(manyDetectionSchema),
  detectionController.createMultipleDetection
)

export default router
