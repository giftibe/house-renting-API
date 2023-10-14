const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { ENUM } = require('../config/config.constant')
const House = require('./house.model')
const uuid = require('uuid');
const rounds = +process.env.ROUNDS
const Schema = mongoose.Schema

const userSchema = new Schema({

    customUserId: {
        type: String,
        default: uuid.v4,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 4,
        trim: true,
    },

    firstName: {
        type: String,
        trim: true,
        default: ENUM.FIRSTNAME,
    },

    lastName: {
        type: String,
        trim: true,
        default: ENUM.LASTNAME,
    },

    company_Name: {
        type: String,
        trim: true,
        default: ENUM.COMPANY
    },

    mobile: {
        type: Number,
        trim: true,
        default: ENUM.MOBILE,
    },

    houseAds: [{
        type: Schema.Types.ObjectId,
        ref: 'House',
        ischecked: true,
        default: [],
    }],

    isVerified: {
        type: Boolean,
        default: false,
    },

    savedItem: [{
        type: Schema.Types.ObjectId,
        ref: 'House',
        default: ENUM.SAVED
    }],

    isBlocked: {
        type: Boolean,
        default: false,
    },

})

userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew("password")) {
        const salt = await bcrypt.genSalt(rounds);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        const salt = await bcrypt.genSalt(rounds);
        update.password = await bcrypt.hash(update.password, salt);
    }
    next();
});


const user = mongoose.model('user', userSchema)
module.exports = user