const express = require('express');
const { swaggerUi, specs } = require('../swagger');
const Router = express.Router();
const userRouter = require('./userRouter');
const proxyRouter = require('./proxyRouter');

Router.get('', (req, res) => {
  res.send("hello world")
});

Router.use('/user', userRouter);
Router.use('/proxy', proxyRouter);
Router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));


module.exports = Router;