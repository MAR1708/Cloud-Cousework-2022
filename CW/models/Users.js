//Library
const mongoose = require('mongoose')

//Schema of users
const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 3,
    max: 256
  },
  email: {
    type: String,
    require: true,
    min: 6,
    max: 256
  },
  password: {
    type: String,
    require: true,
    min: 6,
    max: 1024
  },
  date: {
    type: Date,
    default: Date.now
  }
})
//register model/table into database
module.exports = mongoose.model('users', userSchema)
