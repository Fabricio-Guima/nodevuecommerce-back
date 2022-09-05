const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = Schema({
  name: { type: String, required: true },
  slug: { type: String, required: false },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  status: { type: Boolean, default: true, required: true },
  discount: { type: Boolean, default: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, requried: false },
})

module.exports = mongoose.model('product', productSchema)
