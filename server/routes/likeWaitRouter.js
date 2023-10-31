const express = require('express');
const likeWaitRouter = express.Router();
const likeWaitController = require('../controllers/likeWaitController');

likeWaitRouter.post('/', likeWaitController.postLikeWait);
likeWaitRouter.delete('/', likeWaitController.deleteLikeWait);

module.exports = likeWaitRouter;
