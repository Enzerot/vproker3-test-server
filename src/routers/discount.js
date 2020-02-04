import express from 'express'
import userController from '../controllers/user'
import discountController from '../controllers/discount'
const router = express.Router()

router.route('/discount')
    .get(userController.requireAuth, discountController.get)
    .post(userController.requireAuth, discountController.add)
    .put(userController.requireAuth, discountController.edit)

router.route('/discount/:id')
    .delete(userController.requireAuth, discountController.delete)

router.route('/discount/models')
    .get(userController.requireAuth, discountController.getModels)

export default router