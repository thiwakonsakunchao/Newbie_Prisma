import { Router } from 'express'
import * as userController from './user.controller'
import { z } from 'zod'
import { validatorInput } from '../../middleware/validatorInput'
import { refreshTokenValidate } from '../../middleware/refreshTokenValidate'
const router = Router()

export const userSchema = z.object({
  username: z.string(),
  password: z.string()
})

router.get('/', userController.getAllUser)
router.get('/:id', userController.getUserById)
router.post('/create', validatorInput(userSchema), userController.createUser)
router.put('/update/:id', validatorInput(userSchema), userController.updateUser)
router.delete('/delete/:id', userController.deleteUser)
router.post('/login', userController.loginUser)
router.post('/refresh', refreshTokenValidate, userController.refreshToken)

export default router
