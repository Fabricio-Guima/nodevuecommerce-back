const express = require('express')
const route = express.Router()
const { uploadCloudinary } = require('../middlewares/upload')

//middlewares
const authenticate = require('../middlewares/authenticate')
//contoller
const productController = require('../controllers/productController')

//Routes
route.get(
  '/products-all/:filter?',
  authenticate.decodeToken,
  productController.index
)
route.post(
  '/products',
  [authenticate.decodeToken, uploadCloudinary],
  productController.store
)
route.get('/products/:id', authenticate.decodeToken, productController.show)
route.put(
  '/products/:id',
  [authenticate.decodeToken, uploadCloudinary],
  productController.update
)
route.put(
  '/products/:id/status',
  authenticate.decodeToken,
  productController.updateStatus
)

route.put('/uploads/:id', productController.updateImageCloudinary)

module.exports = route
