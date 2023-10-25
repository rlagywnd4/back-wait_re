const express = require('express');
const waitMateRouter = express.Router();
const waitMateController = require('../controllers/waitMateController');

// waitMate 조회
waitMateRouter.get('/', waitMateController.getWaitMate);
// waitMate(글) 등록
waitMateRouter.post('/', waitMateController.postWaitMate);
// waitMate 삭제
waitMateRouter.delete('/:wmId', waitMateController.deleteWaitMate);
// waitMate 수정
waitMateRouter.patch('/', waitMateController.patchWaitMate);

// waitMate 목록 조회
waitMateRouter.get('/list', waitMateController.getWaitMateList);

module.exports = waitMateRouter;
