const { User }  = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const inValidSignup = async (columnName, value) => {
  if (!value) {
    return `${columnName}값이 존재하지 않습니다.`
  }
  if (columnName === 'password') {
    return false
  }
  const condition = {};
  condition[columnName] = value;
  const response = await User.findOne({
    where : condition
  });
  return response ? `${columnName}값이 이미 존재합니다.` : false
}

exports.register = async (req, res) => {
  try {
    const { userId, password, nickname, email } = req.body;
    const userInfo = { userId, password, nickname, email }
    const errMessages = []
    await Promise.all(
      Object.entries(userInfo).map(async ([k, v]) => {
        const response = await inValidSignup(k, v);
        if (response) {
          errMessages.push(response);
        }
      })
    );
    if (errMessages.length > 0) {
      res.status(400).json({ errors: errMessages });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    await User.create({
      userId,
      password : hashedPassword,
      nickname,
      email
    });
    res.status(201).send('회원 가입 완료');
  } catch (err) {
    console.log(err);
    res.status(500).json({error :err.message});
  }
}

exports.login = async (req, res) => {
  const {userId, password} = req.body
  const response = await User.findOne({
    where : {userId : userId, password : password},
    attributes : ['id', 'userId']
  })
  const data = response?.dataValues
  const token = jwt.sign(data, process.env.SECRET_KEY)
  res.cookie('access', token, {
    maxAge : 24 * 60 * 60 * 1000,
    Path : '/'
  })
  res.status(200).json(data)
}

exports.put = (req, res) => {
  res.send('1')
}

