import express from 'express'
import orderController from '../controllers/order'
import userController from '../controllers/user'
const router = express.Router()

router.route('/order')
    .get(userController.requireAuth, orderController.get)
    .post(userController.requireAuth, orderController.add)
    .put(userController.requireAuth, orderController.edit)
router.route('/order/active')
    .get(userController.requireAuth, orderController.getActive)

router.route('/order/:id')
    .delete(userController.requireAuth, orderController.delete)

router.route('/order/contractNumber')
    .get(userController.requireAuth, orderController.getContractNumber)

router.route('/order/CSVHistory/:startDate/:endDate')
    .get(userController.requireAuth, orderController.getCSVHistory)

export default router