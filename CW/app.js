
//Library
const express=require("express");
const app=express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//configuration for dotenv
require('dotenv/config')

//body parse middleware
app.use(bodyParser.json())

//importing routes
const authRoute = require('./routes/auth')
const postRoute=require('./routes/posts')

//adding routes in application
app.use('/api/user',authRoute);
app.use('/api/post',postRoute);

//connecting to mongodb
mongoose.connect(process.env.DB_CONNECTOR, () => {
  console.log('DB is connected')
})

//start application at post 3000
app.listen(3000,()=>{
  console.log("server started at http://localhost:3000")
})
