const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
const keys = require('./config/keys')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')


const app = express()

mongoose.connect(keys.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('MongoDb connected'))
    .catch(error => console.log(error))


app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use(require('morgan')('dev')) // requests loging
app.use(require('cors')())
app.use('/uploads', express.static('uploads'))

// Old way to parce body. Now Express has body-parser under the hood
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

app.use(express.json({extended: true}));
app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client/dist/client')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'client', 'index.html'))
    })
}



module.exports = app