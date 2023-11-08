const express = require('express');
const reservationRouter = express.Router();
const reservationController = require('../controllers/reservationController');

reservationRouter.get('/', reservationController.getWaitMateReservation);
reservationRouter.get('/list', reservationController.getPickedWaitMate);

module.exports = reservationRouter;
