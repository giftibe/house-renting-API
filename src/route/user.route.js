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
userRouter.patch('/user/updateuser', update_user)
userRouter.post('/user/logout', logOutUser)
userRouter.post('/user/resetpassword', sendUser_ResetPassword_Link)
userRouter.get('/user/paswordcheck/:id', checkUser_ResetPassword_Link)
userRouter.patch('/user/setpassword/:id', update_User_Password)
userRouter.post('/user/createHouse/:id', post_House_Ad)
userRouter.delete('/user/deletehouse/:id', delete_House_Post)
userRouter.patch('/user/updateHouse/:id', update_House_Post)
userRouter.get('/user/allHouses/:id', get_All_MyHouse_Ads)
userRouter.get('/user/houses/saved/:userId/:houseId', saved_For_Later)

module.exports = userRouter