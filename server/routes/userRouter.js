const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.put('', userController.updateUserInfo);
userRouter.delete('', userController.deleteUser);
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/myinfo', userController.myInfo);
userRouter.get('/kakao', userController.kakaoResult);
userRouter.get('/kakao/data', userController.sendKakaoData);
userRouter.get('/kakao/login', userController.kakaoUserLogin);

userRouter.get('/:userId', userController.userInfo);

module.exports = userRouter;