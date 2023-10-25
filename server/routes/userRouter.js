const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')

userRouter.get('', (req, res) => {
  res.send("user router")
})
userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.put('/:id', userController.put)



module.exports = userRouter