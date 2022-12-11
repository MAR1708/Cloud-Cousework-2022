//Library
const mongoose = require('mongoose')

//Schema of like
const likeSchema = mongoose.Schema({
  user: {
    type: String,
    require: true,
    min: 6,
    max: 256
  },
  post: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
})
//register model/table into database
module.exports = mongoose.model('likes', likeSchema)
