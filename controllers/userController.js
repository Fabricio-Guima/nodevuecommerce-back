//models
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('../helpers/jwt')

//methods
const store = async (req, res) => {
  let data = req.body

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

  let user = await User.find({ email })
  if (!user.length > 0) {
    return res.json({ message: 'E-mail não encontrado' })
  }

  bcrypt.compare(password, user[0].password, async (err, check) => {
    if (!check) {
      return res.json({ message: 'Credenciais inválidas ' })
    }
    const token = await jwt.createToken(user[0])
    return res.json({ user: user[0], token })
  })
}

module.exports = { store, login }
