const { Router } = require('express')
const userRouter = Router()

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

userRouter.post('/user/register', create_user)
userRouter.post('/user/login', login_user)
userRouter.patch('/user/updateuser/:customUserId', update_user)
userRouter.post('/user/logout', logOutUser)
userRouter.post('/user/resetpassword', sendUser_ResetPassword_Link)
userRouter.get('/user/paswordcheck/:customUserId/:token', checkUser_ResetPassword_Link)
userRouter.patch('/user/setpassword/:customUserId', update_User_Password)
userRouter.post('/user/createHouse/:customUserId', post_House_Ad)
userRouter.delete('/user/deletehouse/:customHouseId', delete_House_Post)
userRouter.patch('/user/updateHouse/:customHouseId', update_House_Post)
userRouter.get('/user/allHouses/:customUserId', get_All_MyHouse_Ads)
userRouter.get('/user/houses/saved/:customUserId/:customHouseId', saved_For_Later)

module.exports = userRouter