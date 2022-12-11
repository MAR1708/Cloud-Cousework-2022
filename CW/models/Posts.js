//Library
const mongoose = require('mongoose')

//Schema of post
const postSchema = mongoose.Schema({
  title:{
    type: String,
    require: true,
    min: 1,
    max: 1000
  },
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
  date: {
    type: Date,
    default: Date.now
  }
})
//register model/table into database
module.exports = mongoose.model('posts',postSchema )
