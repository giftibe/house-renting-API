const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const database = require('./src/database/database.mongo')
const PORT = process.env.PORT


require('dotenv').config()
require('colors')


app.use(helmet())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.listen(PORT, () => {
    console.log(`🚀 ${"Server up and running".blue}`);
    database()
})