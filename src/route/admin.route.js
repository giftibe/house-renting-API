const { Router } = require('express')
const adminRouter = Router()
const adminController = require('../controller/admin.controller')
const validation = require('../validation/validate.admin')
const isValidUUID = require('../validation/verifyID')

const {
    validate_Account_Creation_Inputs,
    validate_Login_Inputs,
    validate_Admin_Update
} = validation

const {
    signUp_Admin,
    verify_Email,
    login_Admin,
    get_Admin,
    get_All_User,
    get_A_User,
    update_Admin,
    logout_Admin,
    sendAdmin_ResetPassword_Link,
    checkAdmin_ResetPassword_Link,
    update_password
} = adminController

adminRouter.get("/admin/verifyMail/:token", verify_Email);
adminRouter.post('/admin/register', validate_Account_Creation_Inputs, signUp_Admin)
adminRouter.post('/admin/login', validate_Login_Inputs, login_Admin)
adminRouter.post('/admin/logout', logout_Admin)
adminRouter.post('/admin/resetpassword', sendAdmin_ResetPassword_Link)
adminRouter.get('/admin/getUsers', get_All_User)
adminRouter.get('/admin/:customAdminId', isValidUUID, get_Admin)
adminRouter.get('/admin/user/:customUserId', isValidUUID, get_A_User)
adminRouter.get('/admin/paswordcheck/:customAdminId/:token', isValidUUID, checkAdmin_ResetPassword_Link)
adminRouter.patch('/admin/setpassword/:customAdminId', isValidUUID, update_password)
adminRouter.patch('/admin/updateAdmin/:customAdminId', isValidUUID, validate_Admin_Update, update_Admin)

module.exports = adminRouter