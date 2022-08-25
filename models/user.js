const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: true, required: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('user', userSchema)
