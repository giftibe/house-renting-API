const { Router } = require('express')
const router = Router()


const userRouter = require('./user.route')
const adminRouter = require('./admin.route')


router.use('/v1', userRouter)
router.use('/v1', adminRouter)

module.exports = router;