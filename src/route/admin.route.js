const { Router } = require('express')
const adminRouter = Router()
const adminController = require('../controller/admin.controller')
const {
    signUp_Admin,
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


adminRouter.post('/admin/register', signUp_Admin)
adminRouter.post('/admin/login', login_Admin)
adminRouter.post('/admin/logout', logout_Admin)
adminRouter.post('/admin/resetpassword', sendAdmin_ResetPassword_Link)
adminRouter.get('/admin/:id', get_Admin)
adminRouter.get('/admin/users', get_All_User)
adminRouter.get('/admin/user/:id', get_A_User)
adminRouter.get('/admin/paswordcheck/:id/:token', checkAdmin_ResetPassword_Link)
adminRouter.patch('/admin/setpassword/:id', update_password)
adminRouter.patch('/admin/updateAdmin/:id', update_Admin)

module.exports = adminRouter