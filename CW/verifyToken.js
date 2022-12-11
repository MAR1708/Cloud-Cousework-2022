//Library
const jsonwebtoken = require('jsonwebtoken')

//This function will verify token
function auth(req, res, next) {

  //getting token from header
  const token = req.header('auth-token')
  if (!token) { //if token not exists then sending access denied
    return res.status(401).send({ message: 'Access denied' })
  }
  try {
    //verifing token which we got from header with our secreat key inside .env file
    const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
    req.user = verified
    next()
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token' })
  }
}
module.exports = auth
