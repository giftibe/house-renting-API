const userServices = require('../service/user.service')

const {
    createuser,
    verifyEmail,
    loginUser,
    updateAUser,
    sendUserResetPasswordLink,
    checkUserResetPasswordLink,
    updateUserPassword,
    postHouseAd,
    deleteHousePost,
    updateHousePost,
    getAllMyHouseAd,
    savedForLater
} = userServices


class userController {

    //    @route   POST /api/v1/user/createUser
    //     @desc    Handles user account creation
    //     *  @access  Private
    async create_user(req, res) {
        try {

            const data = req.body
            const result = await createuser(data)
            return res.status(200).send({
                message: result,
                success: true
            })
        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }


    //    @route   GET /api/v1/user/verifyMail/:token
    //     @desc    to validate the user email
    //     *  @access  Private

    async verify_Email(req, res) {
        try {
            const data = req.params
            const result = await verifyEmail(data)
            return res.status(200).send({
                message: result,
            })

        }
        catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }



    //    @route   POST /api/v1/user/login
    //     @desc    Handles user login
    //     *  @access  Private
    async login_user(req, res) {
        try {
            const userData = req.body
            const result = await loginUser(userData)
            return res.status(200).send({
                result
            })
        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }

    //    @route   PATCH /api/v1/user/updateUser/:id
    //     @desc    Handles user update
    //     *  @access  Private
    async update_user(req, res) {
        try {
            const data = req.body
            const { customUserId } = req.params
            const result = await updateAUser(customUserId, data)
            return res.status(200).send({
                result: result,
            })
        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }


    //    @route   POST /api/v1/user/logout
    //     @desc    Handles user logout
    //     *  @access  Private

    async logOutUser(req, res) {
        try {
            const token = "";
            await res.cookie("token", token, { httpOnly: true });
            return res.status(200).send({
                message: 'MESSAGES.USER.LOGGEDOUT',
                token: token,
            });
        } catch (error) {
            return res.status(200).send({
                message: MESSAGES.USER.ERROR + error,
            });
        }
    }

    //    @route   POST /api/v1/user/reset-password
    //     @desc    Sends reset password link via mail
    //     *  @access  Public
    async sendUser_ResetPassword_Link(req, res) {
        try {
            const data = req.body
            const result = await sendUserResetPasswordLink(data)
            return res.status(200).send({
                result: result,
            })
        } catch (error) {
            return res.status(200).send({
                message: MESSAGES.USER.ERROR + error,
            });
        }

    }


    //      @route  GET /api/v1/user/check_reset-password/:id/:token
    //     @desc  Verifies link sent to the email checking the token and if the user exists using their ID
    //     *  @access  Unique
    async checkUser_ResetPassword_Link(req, res) {
        try {
            const data = req.params
            const result = await checkUserResetPasswordLink(data)
            return res.status(200).send({
                message: result,
            })
        } catch (error) {
            return res.status(200).send({
                message: 'MESSAGES.USER.SERVER_ERROR ' + error,
            });
        }
    }


    //      @route  PATCH /api/v1/user/setpassword/:id
    //     @desc    updates the password field
    //     *  @access  Private
    async update_User_Password(req, res) {
        try {
            const data = req.body
            const { customUserId } = req.params
            const result = await updateUserPassword(customUserId, data)
            return res.status(200).send({
                result: result
            })
        } catch (error) {
            return res.status(200).send({
                message: 'MESSAGES.USER.SERVER_ERROR ' + error,
            });
        }
    }


    //      @route  POST /api/v1/user/house/createHouse/:id
    //     @desc    create/post a house by user
    //     *  @access  Private
    async post_House_Ad(req, res) {
        try {
            const data = req.body
            const { customUserId } = req.params
            const result = await postHouseAd(customUserId, data)
            return res.status(200).send({
                result: result
            })

        } catch (error) {
            return res.status(200).send({
                message: 'MESSAGES.USER.SERVER_ERROR ' + error,
            });
        }
    }


    //      @route  DELETE /api/v1/user/house/:id
    //     @desc    updates the password field
    //     *  @access  Private
    async delete_House_Post(req, res) {
        try {
            const data = req.params
            const result = await deleteHousePost(data)
            return res.status(200).send({
                message: result
            })

        } catch (error) {
            return res.status(200).send({
                message: 'MESSAGES.USER.SERVER_ERROR ' + error,
            });
        }
    }


    //      @route  PATCH /api/v1/user/updateHouse/:id
    //     @desc    updates the House posted
    //     *  @access  Private
    async update_House_Post(req, res) {
        try {
            const data = req.body
            const { customHouseId } = req.params
            const result = await updateHousePost(customHouseId, data)
            return res.status(200).send({
                message: result
            })
        } catch (error) {
            return res.status(200).send({
                message: 'MESSAGES.USER.SERVER_ERROR ' + error,
            });
        }
    }


    //      @route  GET /api/v1/user/allHouses/:id
    //     @desc    gets all users house
    //     *  @access  Private
    async get_All_MyHouse_Ads(req, res) {
        try {
            const data = req.params
            const result = await getAllMyHouseAd(data)
            return res.status(200).send({
                message: result
            })
        } catch (error) {
            return res.status(200).send({
                message: 'MESSAGES.USER.SERVER_ERROR ' + error,
            });
        }
    }


    //      @route  POST /api/v1/user/houses/saved/:userId/:houseId
    //     @desc    adds a house to a user save section
    //     *  @access  Private
    async saved_For_Later(req, res) {
        try {
            const data = req.params
            const result = await savedForLater(data)
            return res.status(200).send({
                message: result
            })

        } catch (error) {
            return res.status(200).send({
                message: 'MESSAGES.USER.SERVER_ERROR ' + error,
            });
        }
    }
}

module.exports = new userController()