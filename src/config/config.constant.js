ENUM = {
    MOBILE: 0,
    FIRSTNAME: '',
    LASTNAME: '',
    COMPANY: '',
    SAVED: ''
}

MESSAGES = {
    DATABASE: {
        CONNECTED: 'Database connected',
        ERROR: "An error occured while connecting to database ",
    },

    USER: {
        EMAIL_UNSENT: 'Email not sent to receiver ',
        CREATED: 'Account created successfully ',
        EMAIL_DUPLICATE: 'Email already exist ',
        ERROR: 'An error occured '
    }
}

module.exports = { MESSAGES, ENUM }