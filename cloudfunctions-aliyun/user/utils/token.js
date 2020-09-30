const jwt = require('jsonwebtoken')
const { security } = require('config')

function generateToken (uid, scope) {
  const secretKey = security.secretKey
  const expiresIn = security.expiresIn
  const token = jwt.sign({
    uid,
    scope
  }, secretKey, {
    expiresIn
  })
  return token
}

module.exports = {
  generateToken
}
