const { rateLimit } = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    limit: 100, 
    standardHeaders: 'draft-7',
    legacyHeaders: false, 
    message: 'Too many request attempt from this IP address, please try after 5 minutes'
})

module.exports = limiter