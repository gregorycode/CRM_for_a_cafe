const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async (req, res) => {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)

        // total orders number
        const totalOrdersNumber = allOrders.length

        // total days number
        const totalDaysNumber = Object.keys(ordersMap).length

        // orders per day (average)
        const ordersPerDay = (totalOrdersNumber / totalDaysNumber).toFixed(0)

        // yesterday orders
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []

        // yesterday orders numbers
        const yesterdayOrdersNumber = yesterdayOrders.length

        // orders number percent ((orders yesterday / ordersPerDay) - 1) * 100
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)

        // total revenue
        const totalRevenue = calculateRevenue(allOrders)

        // revenue per day
        const revenuePerDay = totalRevenue / totalDaysNumber

        // yesterday revenue
        const yesterdayRevenue = calculateRevenue(yesterdayOrders)

        // revenue percent
        const revenuePercent = (((yesterdayRevenue / revenuePerDay) - 1) * 100).toFixed(2)

        // revenue comparison
        const compareRevenue = (yesterdayRevenue - revenuePerDay).toFixed(2)

        // orders comparison
        const compareOrders = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            revenue: {
               percent: Math.abs(+revenuePercent),
               compare: Math.abs(+compareRevenue),
               yesterday: +yesterdayRevenue,
               isHigher: +revenuePercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareOrders),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.analytics = async (req, res) => {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)

        const averageCheque = +(calculateRevenue(allOrders) / Object.keys(ordersMap).length).toFixed(2)

        //label 05.05.2020
        const chart =  Object.keys(ordersMap).map(label => {
            const revenue = calculateRevenue(ordersMap[label])
            const order = ordersMap[label].length

            return {label,revenue, order}
        })

        res.status(200).json({averageCheque, chart})
    } catch (e) {
        errorHandler(res, e)
    }
}

function getOrdersMap(orders = []) {
    const daysOrder = {};

    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) {
            return
        }

        if (!daysOrder[date]) {
            daysOrder[date] = []
        }

        daysOrder[date].push(order)
    })

    return daysOrder
}

function calculateRevenue(orders = []) {
    return orders.reduce((total, order) => {
        const cost = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.quantity * item.cost
        }, 0)
        return total += cost
    }, 0)
}