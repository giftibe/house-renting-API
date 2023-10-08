const { Router } = require('express')
const userRouter = Router()
const isValidUUID = require('../validation/verifyID')
const validation = require('../validation/validate.user')
const {
    validate_Account_Creation_Inputs,
    validate_Login_Inputs,
    validate_User_Update
} = validation

const userController = require('../controller/user.controller')
const {
    create_user,
    login_user,
    update_user,
    logOutUser,
    sendUser_ResetPassword_Link,
    checkUser_ResetPassword_Link,
    update_User_Password,
    post_House_Ad,
    delete_House_Post,
    update_House_Post,
    get_All_MyHouse_Ads,
    saved_For_Later
} = userController

userRouter.post('/user/register', validate_Account_Creation_Inputs, create_user)
userRouter.post('/user/login', validate_Login_Inputs, login_user)
userRouter.patch('/user/updateuser/:customUserId', isValidUUID, validate_User_Update, update_user)
userRouter.post('/user/logout', logOutUser)
userRouter.post('/user/resetpassword', sendUser_ResetPassword_Link)
userRouter.get('/user/paswordcheck/:customUserId/:token', isValidUUID, checkUser_ResetPassword_Link)
userRouter.patch('/user/setpassword/:customUserId', isValidUUID, update_User_Password)
userRouter.post('/user/createHouse/:customUserId', isValidUUID, post_House_Ad)
userRouter.delete('/user/deletehouse/:customHouseId', delete_House_Post)
userRouter.patch('/user/updateHouse/:customHouseId', isValidUUID, update_House_Post)
userRouter.get('/user/allHouses/:customUserId', isValidUUID, get_All_MyHouse_Ads)
userRouter.get('/user/houses/saved/:customUserId/:customHouseId', isValidUUID, saved_For_Later)

module.exports = userRouter