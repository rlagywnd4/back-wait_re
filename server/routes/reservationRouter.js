const express = require('express');
const reservationRouter = express.Router();
const reservationController = require('../controllers/reservationController');

reservationRouter.get('', reservationController.getWaitMateReservation);

module.exports = reservationRouter;
