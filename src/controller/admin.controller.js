const AdminServices = require('../service/admin.service')
const {
    createAdmin,
    verifyEmail,
    loginAdmin,
    getAUser,
    getAllUser,
    getAnAdmin,
    updateAdmin,
    sendAdminResetPasswordLink,
    checkAdminResetPasswordLink,
    updatePassword,
} = AdminServices

class AdminController {

    //     @desc    signup an Admin
    //     *  @access  Private
    async signUp_Admin(req, res) {
        try {
            const data = req.body
            const result = await createAdmin(data)
            return res.status(201).json({
                result
            })
        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }

    //    @route   GET /api/v1/admin/verifyMail/:token
    //     @desc    to validate the admin email
    //     *  @access  Private

    async verify_Email(req, res) {
        try {
            const data = req.params
            const result = await verifyEmail(data)
            return res.status(200).send({
                message: result,
                success: true
            })
        }
        catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }




    //     @desc    login Admin
    //     *  @access  Private
    async login_Admin(req, res) {
        try {
            const data = req.body
            const result = await loginAdmin(data)
            return res.status(201).send({
                success: true,
                result
            })
        }
        catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }


    //     @desc    find all admins
    //     *  @access  Private
    async get_Admin(req, res) {
        try {
            const data = req.params
            const result = await getAnAdmin(data)
            return res.status(201).send({
                success: true,
                result
            })

        }
        catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }

    //     @desc    find all users
    //     *  @access  Private
    async get_All_User(req, res) {
        try {
            const result = await getAllUser()
            return res.status(201).send({
                result
            })
        }
        catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
            })
        }
    }

    //     @desc    find a users
    //     *  @access  Private
    async get_A_User(req, res) {
        try {
            const data = req.params
            const result = await getAUser(data)
            return res.status(201).send({
                success: true,
                result
            })

        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }

    //     @desc    update an admin
    //     *  @access  Private
    async update_Admin(req, res) {
        try {
            const data = req.body
            const { customAdminId } = req.params
            const result = await updateAdmin(customAdminId, data)
            return res.status(201).send({
                result
            })
        }
        catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }


    //    @route   POST /api/v1/user/logout_Admin
    //     @desc    Handles Admin logout
    //     *  @access  Private

    async logout_Admin(req, res) {
        try {
            const token = "";
            await res.cookie("token", token, { httpOnly: true });
            return res.status(200).send({
                message: 'MESSAGES.USER.LOGGEDOUT',
                token: token,
                success: true,
            });
        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }


    //     @desc    send reset password link
    //     *  @access  Private
    async sendAdmin_ResetPassword_Link(req, res) {
        try {
            const data = req.body
            const result = await sendAdminResetPasswordLink(data)
            return res.status(201).send({
                success: true,
                result
            })
        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }

    //     @desc    validate reset password link
    //     *  @access  Private

    async checkAdmin_ResetPassword_Link(req, res) {
        try {
            const data = req.params
            const result = await checkAdminResetPasswordLink(data)
            return res.status(201).send({
                result
            })
        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }

    //      @route  PATCH 
    //     @desc    updates the password field
    //     *  @access  Private
    async update_password(req, res) {
        try {
            const { customAdminId } = req.params
            const data = req.body
            const result = await updatePassword(customAdminId, data)
            return res.status(201).send({
                result
            })
        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error ' + error,
                success: false
            })
        }
    }
}

module.exports = new AdminController()