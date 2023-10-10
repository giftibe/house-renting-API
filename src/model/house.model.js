const mongoose = require('mongoose')
const Schema = mongoose.Schema
const user = require('./user.model')
const uuid = require('uuid');


const houseModel = new Schema({

    customHouseId: {
        type: String,
        default: uuid.v4,
        unique: true,
    },

    user: {
        type: String,
        required: true,
        trim: true
    },

    title: {
        type: String,
        trim: true,
        required: true,
        minlength: 5
    },

    description: {
        type: String,
        trim: true,
        required: true,
    },

    images: {
        type: [String],
        required: true,
        default: []
    },

    rooms: {
        type: Number,
        required: true,
        trim: true,
    },

    location: {
        type: String,
        required: true,
        trim: true,
    },

    price: {
        type: Number,
        required: true,
        trim: true,
    },

    date_posted: {
        type: Date,
        default: Date.now(),
        required: true
    }
})
const House = mongoose.model('house', houseModel)
module.exports = House