const express = require('express');
const helmet = require('helmet')
const colors = require('colors');
const apicache = require('apicache')
const database = require('./src/database/database.mongo')
const app = express();
const limiter = require('./src/utils/rate.limiter')
app.use(helmet())
app.use(express.urlencoded({ extended: true }))


require('dotenv').config();
const cors = require('cors');
const router = require('./src/route/index.route')
app.use(cors());
const PORT = process.env.PORT

const cache = apicache.middleware
app.use(limiter)
app.use(cache('5 minutes'))
app.use(express.json())
app.use('/api', router)


app.listen(PORT, () => {
    console.log(`🚀 ${'Server up and running'.blue}`);
    database();
});