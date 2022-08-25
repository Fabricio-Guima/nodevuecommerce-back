const jwt = require('jwt-simple')
const moment = require('moment')
let secret = '1MP0ST9Éroumfkdm&%&%#F##G'

exports.decodeToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .json({ message: 'Cabeçalho de autorização não encontrado' })
  }
  let token = req.headers.authorization
  let splitedToken = token.split('.')
  if (splitedToken.length != 3)
    return res
      .status(403)
      .json({ message: 'Cabeçalho de autorização com formato inválido' })

  let payload
  try {
    payload = jwt.decode(token, secret)
  } catch (error) {
    return res
      .status(403)
      .json({ message: 'Não foi possível decodificar o token' })
  }
  req.user = payload
  next()
}
