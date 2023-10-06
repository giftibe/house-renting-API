const Joi = require('joi')

// CREATION OF JOI SCHEMAS

const createAccountSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})


const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const updateUser = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  mobile: Joi.number(),
  country: Joi.string(),
  state: Joi.string(),
  isVerified: Joi.boolean()
})


// VALIDATIONS USING CREATED SCHEMAS

const validate_Account_Creation_Inputs = (req, res, next) => {
  try {
    const validateInput = createAccountSchema.validate(req.body)

    if (validateInput.error) {
      return res.status(404).send({
        success: false,
        status: 'failed',
        errormessage: validateInput.error.details[0].message
      })
    } else {
      next()
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const validate_User_Login_Inputs = (req, res, next) => {
  try {
    const validateInput = loginUserSchema.validate(req.body)

    if (validateInput.error) {
      return res.status(404).send({
        success: false,
        status: 'failed',
        errormessage: validateInput.error.details[0].message
      })
    } else {

      next()
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const validate_User_Update = (req, res, next) => {
  try {
    const validateInput = updateUser.validate(req.body)

    if (validateInput.error) {
      return res.status(404).send({
        success: false,
        status: 'failed',
        errormessage: validateInput.error.details[0].message,
      })
    } else {
      next()
    }
  } catch (err) {
    res.status(500).send(err)
  }
}
module.exports = { validate_Account_Creation_Inputs, validate_User_Login_Inputs, validate_User_Update }