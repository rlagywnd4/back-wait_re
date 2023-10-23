'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = require('./User')(sequelize, Sequelize);
const Proxy = require('./Proxy')(sequelize, Sequelize);
const WaitMate = require('./WaitMate')(sequelize, Sequelize);
const Review = require('./Review')(sequelize, Sequelize);
const ChatRoom = require('./ChatRoom')(sequelize, Sequelize);
const LikeWait = require('./LikeWait')(sequelize, Sequelize);

db.User = User;
db.Proxy = Proxy;
db.WaitMate = WaitMate;
db.Review = Review;
db.ChatRoom = ChatRoom;
db.LikeWait = LikeWait;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;