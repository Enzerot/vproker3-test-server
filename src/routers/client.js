import express from 'express'
import clientController from '../controllers/client'
import userController from '../controllers/user'
const router = express.Router()

router.route('/client')
    .get(userController.requireAuth, clientController.get)
    .post(userController.requireAuth, clientController.add)
    .put(userController.requireAuth, clientController.edit)

router.route('/client/:id')
    .delete(userController.requireAuth, clientController.delete)

router.route('/client/blacklist/add/:id')
    .put(userController.requireAuth, clientController.addToBlackList)
router.route('/client/blacklist/remove/:id')
    .put(userController.requireAuth, clientController.removeFromBlackList)

router.route('/client/validatePassport/:passport')
    .get(userController.requireAuth, clientController.validatePassport)

router.route('/client/byPhoneNumber/:phoneNumber')
    .get(userController.requireAuth, clientController.getByPhoneNumber)
router.route('/client/byName/:name')
    .get(userController.requireAuth, clientController.getByName)
router.route('/client/byPassport/:passport')
    .get(userController.requireAuth, clientController.getByPassport)

router.route('/client/checkDebt')
    .get(userController.requireAuth, clientController.checkDebt)

export default router