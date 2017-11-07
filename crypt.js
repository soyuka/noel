// Nodejs encryption with CTR
var crypto = require('crypto')
var algorithm = 'aes-256-ctr'

module.exports.crypt = function encrypt(text, password){
  var cipher = crypto.createCipher(algorithm, password)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

module.exports.decrypt = function decrypt(text, password){
  var decipher = crypto.createDecipher(algorithm, password)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}
