//models
const Product = require('../models/product')
const { BlockedUser, InvalidProduct } = require('../errors/exceptions')

const slugify = require('slugify')

//methods
const index = async (req, res) => {
  if (!req.user) return res.json({ message: 'Error token' })
  let filter = req.params.filter || ''
  console.log('filter ', filter)
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
  if (!req.user) return res.status(401).json({ message: 'Error token' })
  if (!req.image)
    return res.status(401).json({ message: 'Não foi possível salvar imagem' })

  var product = req.body
  const finalProduct = req.body
  finalProduct.image = req.image
  product.image = req.image

  try {
    product = await Product.findOne({ name: product.name })

    if (product) {
      throw new InvalidProduct(401)
    }
    let result = await Product.create(finalProduct)

    return res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error })
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
