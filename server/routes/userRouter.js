const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/myinfo', userController.myInfo);
userRouter.get('/:userId', userController.userInfo);
userRouter.put('', userController.updateUserInfo);
userRouter.delete('', userController.deleteUser);

module.exports = userRouter;