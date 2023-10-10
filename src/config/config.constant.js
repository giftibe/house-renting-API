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
        ERROR: 'An error occured ',
        RESET_PASSWORD_LINK_SENT: 'Reset pasword link sent to mail ',
        ACCOUNT_NOT_REGISTERED: 'Account is not registered ',
        VALID_LINK: 'Link is valid ',
        INVALID_LINK: 'Link is invalid ',
        PASSWORD_UPDATED: 'Password Updated Successfully'
    }
}

module.exports = { MESSAGES, ENUM }