const express = require('express');
const proxyRouter = express.Router();
const proxyController = require('../controllers/proxyController');

/**
 * @swagger
 * tags:
 *   name: Proxy
 *   description: 프록시 관련 API
 */

/**
 * @swagger
 * /proxy:
 *   post:
 *     summary: 프록시(글)쓰기 불러오기
 *     tags: [Proxy]
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: 'Hello, Swagger!'
 */
proxyRouter.post('/register', proxyController.input.postRegister);

proxyRouter.get('/getter', proxyController.output.getProxyAll);
proxyRouter.get('/getter/:proxyId', proxyController.output.getProxyOne);

//등록된 프록시를 변경
proxyRouter.patch('/update/:id', proxyController.input.updateProxy);
//등록된 프록시를 삭제
proxyRouter.delete('/delete/:proxyId', proxyController.input.deleteRegister);


module.exports = proxyRouter;