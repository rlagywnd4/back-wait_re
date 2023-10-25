const express = require('express');
const waitMateRouter = express.Router();
const waitMateController = require('../controllers/waitMateController');

// waitMate(글) 등록
waitMateRouter.post('/', waitMateController.postWaitMate);

// waitMate 목록 조회
waitMateRouter.get('/list', waitMateController.getWaitMateList);

module.exports = waitMateRouter;
