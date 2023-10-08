const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const database = require('./src/database/database.mongo')
const router = require('./src/route/index.route')
const PORT = process.env.PORT


require('dotenv').config()
require('colors')


app.use(helmet())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/api", router);


app.listen(PORT, () => {
    console.log(`🚀 ${"Server up and running".blue}`);
    database()
})