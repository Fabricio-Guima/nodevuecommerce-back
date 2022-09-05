const express = require('express')
const route = express.Router()
const upload = require('../middlewares/upload')

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
  [authenticate.decodeToken, upload],
  productController.store
)
route.get('/products/:id', authenticate.decodeToken, productController.show)
route.put('/products/:id', authenticate.decodeToken, productController.update)
route.put(
  '/products/:id/status',
  authenticate.decodeToken,
  productController.updateStatus
)

module.exports = route
