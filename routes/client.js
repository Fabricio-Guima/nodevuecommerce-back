const express = require('express')
const route = express.Router()
const clientController = require('../controllers/clientController')

route.get('/testing', clientController.testing)

module.exports = route
