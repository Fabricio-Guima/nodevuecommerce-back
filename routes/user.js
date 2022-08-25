const express = require('express')
const route = express.Router()
//middlewares
const authenticate = require('../middlewares/authenticate')
//contoller
const userController = require('../controllers/userController')

//Routes
route.post('/users', authenticate.decodeToken, userController.store)
route.post('/login', userController.login)

module.exports = route
