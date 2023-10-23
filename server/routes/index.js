const express = require('express');
const { swaggerUi, specs } = require('../swagger');
const Router = express.Router();
const userRouter = require('./userRouter');

Router.get('', (req, res) => {
  res.send("hello world")
});

Router.use('/user', userRouter)
Router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));


module.exports = Router;