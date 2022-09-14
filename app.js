require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const fileUpload = require('express-fileupload')

//conexao banco
const PORT = process.env.PORT || 3000
mongoose.connect(
  'mongodb://127.0.0.1:27017/loja-node',
  { useNewUrlParser: true, useUnifiedTopology: true, createIndexes: true },
  (error, res) => {
    if (error) {
      console.log('Error ao conectar no banco: ', error)
    } else {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })
    }
  }
)

//body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
)

//evitar erro de cors
app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*', 'http://localhost:8080')
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method'
  )
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS')
  next()
})

//rotas
const clientRoutes = require('./routes/client')
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
app.use('/api', clientRoutes)
app.use('/api', userRoutes)
app.use('/api', productRoutes)

module.exports = app
