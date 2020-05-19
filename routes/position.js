const express = require('express')
const passport = require('passport')
const controller = require('../controllers/position.controller')

const router = express.Router()

router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getPositionByCategoryID)
router.post('/', passport.authenticate('jwt', {session: false}), controller.createPosition)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.updatePosition)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.removePosition)

module.exports = router