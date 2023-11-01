const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const Common = require('../common');

userRouter.put('', Common.upload(`profileImg/`).single('profileImg'), userController.updateUserInfo);
userRouter.delete('', userController.deleteUser);
userRouter.post('/register', Common.upload(`profileImg/`).single('profileImg'), userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/myinfo', userController.myInfo);
userRouter.get('/kakao', userController.kakaoResult);
userRouter.get('/kakao/data', userController.sendKakaoData);
userRouter.get('/kakao/login', userController.kakaoUserLogin);
userRouter.post('/img', Common.upload(`profileImg/`).single('profileImg'),  userController.uploadImage);
userRouter.post('/check/nickname', userController.checkNickname);
userRouter.post('/check/userId', userController.checkUserId);

userRouter.get('/:userId', userController.userInfo);

module.exports = userRouter;