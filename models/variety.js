const mongoose = require('mongoose')
const Schema = mongoose.Schema

const varietySchema = Schema({
  provider: { type: String, required: true },
  variety: { type: String, required: true },
  sku: { type: String, required: true },
  product: { type: Schema.ObjectId, ref: 'product', required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, requried: false },
})

module.exports = mongoose.model('variety', varietySchema)
