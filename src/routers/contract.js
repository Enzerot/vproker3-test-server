import express from 'express'
import contractController from '../controllers/contract'
const router = express.Router()

router.route('/contract')
    .get(contractController.get)

export default router