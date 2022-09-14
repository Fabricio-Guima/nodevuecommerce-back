//models
const Product = require('../models/product')
const { BlockedUser, InvalidProduct } = require('../errors/exceptions')
const fs = require('fs')
const slugify = require('slugify')
const path = require('path')
const mongoose = require('mongoose')
const { uploadCloudinary } = require('../middlewares/upload')
const cloudinary = require('cloudinary').v2

//methods
const index = async (req, res) => {
  if (!req.user) return res.json({ message: 'Error token' })
  let filter = req.params.filter || ''

  try {
    let products = await Product.find({
      $or: [
        { name: new RegExp(filter, 'i') },
        { category: new RegExp(filter, 'i') },
      ],
    })

    res.status(200).json(products)
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
  finalProduct.slug = slugify(req.body.name)
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
    let product = await Product.findById({ _id: id })
    res.status(200).json(product)
  } catch (error) {
    console.log('error', error)
  }
}

const update = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Error token' })
  try {
    const product = await Product.findById(
      { _id: req.params.id },
      {
        new: true,
      }
    )

    //deletar a imagem no cloudinary
    if (product.image) {
      const splitedNameImage = product.image.split('/')
      const nameImage = splitedNameImage[splitedNameImage.length - 1]
      const [public_id] = nameImage.split('.')

      cloudinary.uploader.destroy(public_id)
    }

    //...spread operator nao quer funcionar
    product.name = req.body.name
    product.category = req.body.category
    product.status = req.body.status
    product.discount = req.body.discount
    product.price = req.body.price
    product.description = req.body.description
    product.image = req.image
    product.save()

    res.status(200).json(product)
  } catch (error) {
    res.status(error.status).json(error)
  }
}

const updateStatus = async (req, res) => {
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

// const updateImage = async (req, res) => {
//   const { id } = req.params

//   try {
//     let product = await Product.findById({ _id: id })
//     console.log('product aqui', product)

//     if (!product) {
//       throw new InvalidProduct(401)
//     }

//     if (product.image) {
//       const imagePath = path.join(
//         __dirname,
//         '../uploads/products',
//         product.image
//       )
//       console.log('imagePath', imagePath)
//       //busque e elimine a imagem
//       if (fs.existsSync(imagePath)) {
//         console.log('apagando a imagem')
//         fs.unlinkSync(imagePath)
//       }

//       product.image = req.image
//     }

//     product.image = 'kkkkkkkkkkkkkkkkkkk'

//     console.log('produto final com imagem atualizada', product)

//     res.status(200).json(product)
//   } catch (error) {
//     res.status(400).json(error)
//   }
// }

const updateImageCloudinary = async (req, res) => {
  const { id } = req.params

  try {
    let product = await Product.findById({ _id: id })

    if (!product) {
      throw new InvalidProduct(401)
    }

    if (product.image) {
      const splitedNameImage = product.image.split('/')
      const nameImage = splitedNameImage[splitedNameImage.length - 1]
      const [public_id] = nameImage.split('.')

      cloudinary.uploader.destroy(public_id)
    }

    product.image = req.image
    product.save()

    res.status(200).json(product)
  } catch (error) {
    console.log('error', error)
  }
}

module.exports = {
  index,
  store,
  show,
  update,
  updateStatus,
  updateImageCloudinary,
}
