
let express = require('express')
let routes = express.Router()
let authController = require('../controllers/auth_controller')
let authenticationController = require('../controllers/auth_controller');


routes.get('/accounts', authController.readAccounts)
routes.post('/accounts', authController.createAccount)
routes.post('/accounts/login', authController.loginAccount)
routes.use('*', authenticationController.validateToken);
routes.put('/accounts', authController.updateAccount)
routes.delete('/accounts', authController.deleteAccount)

module.exports = routes
