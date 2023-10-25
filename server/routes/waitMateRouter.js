const express = require('express');
const waitMateRouter = express.Router();
const waitMateController = require('../controllers/waitMateController');

// waitMate 조회
waitMateRouter.get('/', waitMateController.getWaitMate);
// waitMate 목록 조회
waitMateRouter.get('/list', waitMateController.getWaitMateList);

// waitMate(글) 등록
waitMateRouter.post('/', waitMateController.postWaitMate);

module.exports = waitMateRouter;
