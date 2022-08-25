const express = require('express')
const route = express.Router()
//contoller
const userController = require('../controllers/userController')

//Routes
route.post('/users', userController.store)
route.post('/login', userController.login)

module.exports = route
