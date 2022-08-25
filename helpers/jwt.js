const jwt = require('jwt-simple')
const moment = require('moment')
let secret = '1MP0ST9Éroumfkdm&%&%#F##G'

exports.createToken = user => {
  let payload = {
    sub: user._id,
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(1, 'day').unix(),
  }

  return jwt.encode(payload, secret)
}
