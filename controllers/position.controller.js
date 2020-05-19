const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getPositionByCategoryID = async (req, res) => {
    try {
        const positions = await Position.find({
            category: req.params.id,
            user: req.user.id
        })

        res.status(200).json(positions)

    } catch (e) {
         errorHandler(res, e)
    }
}

module.exports.createPosition = async (req, res) => {
    try {
        const position = await new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id
        }).save()

        res.status(201).json(position)

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.removePosition = async (req, res) => {

    try {
        await Position.remove({_id: req.params.id})
        res.status(200).json({
            message: "Position has been successfully removed"
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updatePosition = async (req, res) => {

    try {
        const position = await Position.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(position)
    } catch (e) {
        errorHandler(res, e)
    }
}