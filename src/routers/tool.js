import express from 'express'
import toolController from '../controllers/tool'
import userController from '../controllers/user'
const router = express.Router()

router.route('/tool')
    .get(userController.requireAuth, toolController.get)
    .post(userController.requireAuth, toolController.add)
    .put(userController.requireAuth, toolController.edit)

router.route('/tool/:id')
    .delete(userController.requireAuth, toolController.delete)

router.route('/tool/models')
    .get(userController.requireAuth, toolController.getModels)
router.route('/tool/detailModels')
    .get(userController.requireAuth, toolController.getDetailModels)

router.route('/tool/inventoryNumber')
    .get(userController.requireAuth, toolController.getLastInventoryNumber)
    .put(userController.requireAuth, toolController.editInventoryNumber)

export default router