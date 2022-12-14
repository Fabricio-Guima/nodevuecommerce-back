//models
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('../helpers/jwt')
const {
  InvalidLogin,
  InvalidEmail,
  BlockedUser,
} = require('../errors/exceptions')

//methods
const index = async (req, res) => {
  if (!req.user) return res.json({ message: 'Error token' })
  let filter = req.params.filter || ''

  try {
    let users = await User.find({
      $or: [
        { name: new RegExp(filter, 'i') },
        { nickname: new RegExp(filter, 'i') },
        { email: new RegExp(filter, 'i') },
      ],
    })

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error ao listar os usuários' })
  }
}
const store = async (req, res) => {
  console.log('user criado no middleware pego no controller', req.user)
  let data = req.body
  try {
    //validação meio idiota, mas vou deixar aqui
    if (!req.user) return res.json({ message: 'Error token' })

    let user = await User.find({ email: data.email })

    if (user.length > 0) {
      throw new InvalidEmail(401)
    }

    bcrypt.hash('123456', 10, async (err, hash) => {
      if (err) {
        res.json({ data: undefined, message: 'Não foi possível gerar a senha' })
      }

      data.password = hash
      let user = await User.create(data)
      return res.status(200).json(user)
    })
  } catch (error) {
    res.status(error.status).json(error)
  }
}
const show = async (req, res) => {
  const { id } = req.params

  try {
    let user = await User.findById({ _id: id })
    console.log('user show', user)
    res.status(200).json(user)
  } catch (error) {
    console.log('error', error)
  }
}

const update = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Error token' })
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    )
    res.status(200).json(user)
  } catch (error) {
    res.status(error.status).json(error)
  }
}

const updateStatus = async (req, res) => {
  console.log('back updateStatus', req.body)
  console.log('back updateStatus', req.params.id)
  if (!req.user) return res.status(401).json({ message: 'Error token' })

  let status = !req.body.status
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { status: status },
      {
        new: true,
      }
    )
    res.status(200).json(user)
  } catch (error) {
    res.status(error.status).json(error)
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    let user = await User.find({ email })

    if (!user) {
      throw new InvalidLogin(401)
    }

    if (!user[0].status) {
      throw new BlockedUser(401)
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

const me = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Error token' })

  return res.status(200).json({ user: req.user })
}

const products = async (req, res) => {
  console.log('req.body', req.body)
  res.status(200).json(req.body)
}

module.exports = {
  index,
  store,
  show,
  update,
  updateStatus,
  login,
  me,
  products,
}
