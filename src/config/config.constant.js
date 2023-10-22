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
        PASSWORD_UPDATED: 'Password Updated Successfully',
        N_CREATED: "User account creation unsuccessfully",
        USER_FOUND: "Users found successfully",
        USER_NOT_FOUND: "User not found",
        ENTER_EMAIL: "Enter email address",
        DUPLICATE_USERNAME: "Username already exists",
        REGISTERED: "Registration successful",
        EMAIL_NOTFOUND: "Email not found",
        LOGGEDIN: "Logged in successfully",
        W_PASSWORD: "Wrong password",
        INCORRECT_DETAILS: "Invalid credentials",
        LOGGEDOUT: "successfully loggedout",
        ACCOUNT_DELETED: "Account deleted successfully",
        NOT_ACCOUNT_DELETED: "Unable to delete user account",
        ACCOUNT_UPDATED: "Account updated successfully",
        NOT_UPDATED: "Account updated unsuccessful",
        UNAUTHORIZED: "Unauthorized access ",
        EMAIL_SENT: "Reset link has been sent to your email",
        INVALID_LINK: "Link is invalid or has expired",
        EMAIL_VER_FAILED: "Email verification failed.",
        EMAIL_VERIFIED: "Email verified successfully.",
        WELCOME_EMAIL_ERROR: "error sending welcome email",
        INVALID_TOKEN: "Invalid or expired verification token.",
        NOT_VERIFIED: "user is not verified.",
        EMAIL_NOT_VERIFIED:
            "Email not verified. Please check your email for a verification link.",
        PICTURE_UPLOADED: "Picture uploaded successfully",
        PICTURE_NOT_UPLOADED: "Picture not uploaded",
        HOUSE_CREATED: 'House created successfully',
        ABS_HOUSE: 'No such House post exist',
        DEL_HOUSE: 'Post successfully deleted',
        UPDATE_HOUSE: 'House post updated successfully',
        NO_ADS: 'No ads posted',
        HOUSES_FOUND: 'Houses found successfully',
        SAVED_HOUSE: 'House saved for later',
        NOT_SAVED_HOUSE: 'House not saved for later'
    }
}

module.exports = { MESSAGES, ENUM }