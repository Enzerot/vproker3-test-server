import express from 'express'
import maintainController from '../controllers/maintain'
import userController from '../controllers/user'
const router = express.Router()

router.route('/maintain')
    .get(userController.requireAuth, maintainController.get)
    .post(userController.requireAuth, maintainController.add)
    .put(userController.requireAuth, maintainController.edit)

router.route('/maintain/:id')
    .delete(userController.requireAuth, maintainController.delete)

export default router