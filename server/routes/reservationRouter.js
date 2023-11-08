const express = require('express');
const reservationRouter = express.Router();
const reservationController = require('../controllers/reservationController');

reservationRouter.get('/', reservationController.getWaitMateReservation);
reservationRouter.get('/wmList', reservationController.getPickedWaitMate);
reservationRouter.get('/proxyList', reservationController.getPickedProxy);

module.exports = reservationRouter;
