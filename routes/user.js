const express = require('express')
const route = express.Router()
//middlewares
const authenticate = require('../middlewares/authenticate')
//contoller
const userController = require('../controllers/userController')

//Routes
route.get('/users-all/:filter?', authenticate.decodeToken, userController.index)
route.post('/users', authenticate.decodeToken, userController.store)
route.get('/users/:id', authenticate.decodeToken, userController.show)
route.put('/users/:id', authenticate.decodeToken, userController.update)
route.put(
  '/users/:id/status',
  authenticate.decodeToken,
  userController.updateStatus
)
route.post('/login', userController.login)
route.get('/me', authenticate.decodeToken, userController.me)

module.exports = route
