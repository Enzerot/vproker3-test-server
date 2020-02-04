import express from 'express'
import consumableController from '../controllers/consumable'
import userController from '../controllers/user'
const router = express.Router()

router.route('/consumable')
    .get(userController.requireAuth, consumableController.get)
    .post(userController.requireAuth, consumableController.add)
    .put(userController.requireAuth, consumableController.edit)

router.route('/consumable/:id')
    .delete(userController.requireAuth, consumableController.delete)

router.route('/consumable/models')
    .get(userController.requireAuth, consumableController.getModels)

export default router