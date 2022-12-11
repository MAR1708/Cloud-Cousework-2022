//Library
const mongoose = require('mongoose')

//Schema of comments
const commentSchema = mongoose.Schema({
  content: {
    type: String,
    require: true,
    min: 1,
    max: 1000
  },
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
module.exports = mongoose.model('comments', commentSchema)
