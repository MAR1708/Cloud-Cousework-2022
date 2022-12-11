
//importing library
const joi = require('joi')

//validation schema for registration
const registerValidation = (data) => {
  const schemaValidation = joi.object({
    username: joi.string().required().min(3).max(256),
    email: joi.string().required().min(6).max(256).email(),
    password: joi.string().required().min(6).max(1024)
  })
  return schemaValidation.validate(data)
}

//validation schema for login
const loginValidation = (data) => {
  const schemaValidation = joi.object({
    email: joi.string().required().min(6).max(256).email(),
    password: joi.string().required().min(6).max(1024)
  })
  return schemaValidation.validate(data)
}

//exporting schema
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
