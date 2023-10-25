const { User, Review, Proxy, WaitMate }  = require('../models');
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
  try {
    const {userId, password} = req.body
    let user = await User.findOne({
      where : {userId : userId},
      attributes : ['id', 'userId', 'password']
    });
    user = user?.dataValues
    if (!user) {
      return res.status(401).json({ message: '회원가입되지 않은 유저입니다.' });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '올바르지 않은 비밀번호 입니다.' });
    }
    const userInfo = {};
    userInfo['userId'] = user.userId;
    userInfo['id'] = user.id;
    const token = jwt.sign(userInfo, process.env.SECRET_KEY);
    res.cookie('access', token, {
      maxAge : 24 * 60 * 60 * 1000,
      Path : '/'
    })
    res.status(200).json({ ...user, password : '' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' })
  }
}

exports.put = (req, res) => {
  res.send('1')
}

exports.myInfo = async (req, res) => {
  try {
    const access = req.cookies?.access
    if (!access) {
      res.status(401).json({message : '로그인을 먼저 해주세요'})
    }
    await jwt.verify(access, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        res.status(403).json({message : '유효하지 않은 토큰입니다.'})
      }
      const id = decoded?.id
      const response = await User.findOne({
        where : {id},
        attributes : ['userId', 'email', 'nickname', 'photo', 'createdAt', 'updatedAt'],
        include : [
          {model : Review},
          {model : Proxy},
          {model : WaitMate},
        ],
      })
      res.send(response)
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' })
  }
}

exports.userInfo = async (req, res) => {
  try {
    const id = req.params?.userId
    const response = await User.findOne({
      where : {id},
      attributes : ['userId', 'email', 'nickname', 'photo', 'createdAt', 'updatedAt'],
      include : [
        {model : Review},
        {model : Proxy},
        {model : WaitMate},
      ],
    })
    if (!response) {
      res.status(404).json({message : '존재하지 않는 사용자 입니다.'})
    } else {
      res.send(response)
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' })
  }
}
