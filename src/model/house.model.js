const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ENUM = require('../config/config.constant')
const Seller = require('./seller.model')

const houseModel = new Schema({

    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        require: true
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

    option: {
        type: [ENUM.OPTION[0], ENUM.OPTION[1]],
        required: true,
        default: ENUM.OPTION[0]
    },

    date_posted: {
        type: Date,
        default: Date.now(),
        required: true
    }
})
const House = mongoose.model('house', houseModel)
module.exports = House