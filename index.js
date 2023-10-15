const express = require('express');
const helmet = require('helmet')
const colors = require('colors');
const database = require('./src/database/database.mongo')
const app = express();
app.use(helmet())
app.use(express.urlencoded({ extended: true }))


require('dotenv').config();
const cors = require('cors');
const router = require('./src/route/index.route')
app.use(cors());
const PORT = process.env.PORT


app.use(express.json())
app.use('/api', router)


app.listen(PORT, () => {
    console.log(`🚀 ${'Server up and running'.blue}`);
    database();
});