const express = require('express')
const passport = require('passport')
const controller = require('../controllers/order.controller')
const router = express.Router()

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAllOrders)
router.post('/', passport.authenticate('jwt', {session: false}), controller.createOrder)


module.exports = router