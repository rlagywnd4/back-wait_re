const express = require('express');
const { swaggerUi, specs } = require('../swagger');
const Router = express.Router();

Router.get('', (req, res) => {
  res.send("hello world")
});
Router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = Router