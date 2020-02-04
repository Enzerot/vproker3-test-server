import express from 'express'
import inventoryController from '../controllers/inventory'
import userController from '../controllers/user'
const router = express.Router()

router.route('/inventory')
    .get(userController.requireAuth, inventoryController.get)
    .post(userController.requireAuth, inventoryController.add)
    .put(userController.requireAuth, inventoryController.edit)

router.route('/inventory/:id')
    .delete(userController.requireAuth, inventoryController.delete)

export default router