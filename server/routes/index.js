const express = require('express');
const { swaggerUi, specs } = require('../swagger');
const Router = express.Router();
const userRouter = require('./userRouter');

const proxyRouter = require('./proxyRouter');

Router.get('', (req, res) => {
  res.send("hello world")
});


Router.use('/proxy', proxyRouter);

const waitMateRouter = require('./waitMateRouter');

Router.use('/user', userRouter);
Router.use('/waitMate', waitMateRouter);

Router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = Router;
