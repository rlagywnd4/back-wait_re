const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
// const { sequelize } = require('./models');
const Router = require('./routes');
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api', Router);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} listening`);
});
