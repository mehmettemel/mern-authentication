const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/user.js')
const { connectDB } = require('./config/db.js')

const app = express()
connectDB()

//application middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')) //morgan shows requests in terminal
  app.use(cors({ origin: `http://localhost:3000` })) //allows all origins
}
app.use(bodyParser.json())

//middleware
app.use('/api', authRoutes)
app.use('/api', userRoutes)

const port = process.env.PORT
app.listen(port)
