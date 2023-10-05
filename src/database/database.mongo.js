const mongoose = require('mongoose')
require('colors')
const Boom = require('@hapi/boom');
const { MESSAGES } = require('../config/config.constant');

async function database() {
    mongoose
        .set('strictQuery', true)
        .connect(process.env.DATABASE_URI)
        .then(() => {
            console.log(`${"✔✔✔".green}`, MESSAGES.DATABASE.CONNECTED.yellow);
        })
        .catch((err) => {
            console.log(MESSAGES.DATABASE.ERROR.red + err);
            throw Boom.internal('Database connection failed'.red)
        });
}
module.exports = database