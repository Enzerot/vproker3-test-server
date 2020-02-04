import express from 'express'
import userController from '../controllers/user'
const router = express.Router()

router.route('/user/auth')
    .post(userController.auth)
router.route('/user/checkToken')
    .get(userController.requireAuth, userController.checkToken)

export default router