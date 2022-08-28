//models
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('../helpers/jwt')
const { InvalidLogin } = require('../errors/exceptions')

//methods
const store = async (req, res) => {
  console.log('user criado no middleware pego no controller', req.user)
  let data = req.body

  //validação meio idiota, mas vou deixar aqui
  if (!req.user) return res.json({ message: 'Error token' })

  let user = await User.find({ email: data.email })

  if (user.length > 0) {
    return res.json({ message: 'E-mail inválido para cadastrar usuário' })
  }

  bcrypt.hash('123456', 10, async (err, hash) => {
    if (err) {
      res.json({ data: undefined, message: 'Não foi possível gerar a senha' })
    }

    data.password = hash
    let user = await User.create(data)
    return res.status(200).json(user)
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    let user = await User.find({ email })

    if (!user) {
      throw new InvalidLogin(401)
    }

    const match = await bcrypt.compareSync(password, user[0].password)
    console.log('match')
    if (!match) {
      throw new InvalidLogin(401)
    }

    const token = await jwt.createToken(user[0])
    return res.json({ user: user[0], token })
  } catch (error) {
    res.status(error.status).json(error)
  }
}

module.exports = { store, login }
