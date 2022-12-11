
//Library
const express = require('express')
const router = express.Router()

//importing model
const User = require('../models/Users')

//importing function for valiadation
const { registerValidation, loginValidation } = require('../validations/validation')

//Library for password
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

//route for register
router.post('/register', async (req, res) => {

  // Validation 1 to check user input
  console.log(req.body)
  const { error } = registerValidation(req.body)
  if (error) {
    return res.status(400).send({ message: error['details'][0]['message'] })
  }

  // Validation 2 to check if user exists
  const userExists = await User.findOne({ email: req.body.email })
  if (userExists) {
    return res.status(400).send({ message: 'User already exists' })
  }


  // I created a hashed represenation of my password
  const salt = await bcryptjs.genSalt(5) //generating random text
  const hashedPassword = await bcryptjs.hash(req.body.password, salt)// generating hash password by using random text (because if 2user have same password so their hashed/encrypted password will be different)

  // Code to insert data
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  })
  try {
    const savedUser = await user.save()
    res.send(savedUser)
  } catch (err) {
    res.status(400).send({ message: err })
  }

})

//route for login
router.post('/login', async (req, res) => {

  // Validation 1 to check user input
  const { error } = loginValidation(req.body)
  if (error) {
    return res.status(400).send({ message: error['details'][0]['message'] })
  }

  // Validation 2 to check if user exists
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(400).send({ message: 'User does not exist' })
  }

  // Validation 3 to check user password
  const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
  if (!passwordValidation) {
    return res.status(400).send({ message: 'Password is wrong' })
  }

  // JWT - Generate an auth-token
  const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send({ 'auth-token': token })

})


module.exports = router
