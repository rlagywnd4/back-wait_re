const express = require('express');
const proxyRouter = express.Router();
const proxyController = require('../controllers/proxyController');

//프록시 글 등록
proxyRouter.post('/register', proxyController.input.postRegister);

//프록시 글 리스트 뽑아오기
proxyRouter.get('/getter', proxyController.output.getProxyAll);
//프록시 특정 글 보기
proxyRouter.get('/getter/:proxyId', proxyController.output.getProxyOne);

//등록된 프록시를 변경
proxyRouter.patch('/update/:id', proxyController.input.updateProxy);
//등록된 프록시를 삭제
proxyRouter.delete('/delete/:proxyId', proxyController.input.deleteRegister);


module.exports = proxyRouter;