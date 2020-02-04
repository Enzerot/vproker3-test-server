import express from 'express'
import rigController from '../controllers/rig'
import userController from '../controllers/user'
const router = express.Router()

router.route('/rig')
    .get(userController.requireAuth, rigController.get)
    .post(userController.requireAuth, rigController.add)
    .put(userController.requireAuth, rigController.edit)

router.route('/rig/:id')
    .delete(userController.requireAuth, rigController.delete)

router.route('/rig/models')
    .get(userController.requireAuth, rigController.getModels)

export default router