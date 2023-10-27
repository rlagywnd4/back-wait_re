const { User, Review, Proxy, WaitMate }  = require('../models');
const Common = require('../common');
const bcryptjs = require('bcryptjs');
const axios = require('axios');
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
};
const accessDecode = async (token) => {
  await jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    const response = await User.findOne({
      where : {id},
      attributes : ['userId', 'email', 'nickname', 'photo', 'createdAt', 'updatedAt'],
    })
    return response
  })
};
const kakaoLogin = async () => {
  
};
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
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      await User.create({
        userId,
        password : hashedPassword,
        nickname,
        email
      });
      res.status(201).json({ message : '회원 가입 완료' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({error :err.message});
  }
};
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
    } else {
      const userInfo = {};
      userInfo['userId'] = user.userId;
      userInfo['id'] = user.id;
      const token = jwt.sign(userInfo, process.env.SECRET_KEY);
      res.cookie('access', token, {
        maxAge : 24 * 60 * 60 * 1000,
        Path : '/'
      })
      res.status(200).json({ ...user, password : '' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' })
  }
};
exports.myInfo = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    if (!userInfo) {
      res.status(401).json({message : '로그인을 먼저 해주세요'})
    } else {
      res.json(userInfo);
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' })
  }
};
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
};
exports.updateUserInfo = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    console.log(userInfo)
    if (!userInfo) {
      res.status(401).json({message : '로그인을 먼저 해주세요'});
    };
    if (req.body.userId) {
      res.status(403).json({message : '아이디는 변경할 수 없습니다.'});
    };
    if (req.body.password) {
      req.body.password = await bcryptjs.hash(req.body.password, 10);
    };
    const response = await User.update(req.body, {
      where : {id : userInfo.id}
    });
    if (response) {
      res.status(201).json({message : '업데이트가 완료되었습니다.'});
    } else {
      res.status(400).json({message : '이미 존재하는 값이거나 존재하지 않는 필드이름 입니다.'});
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    if (!userInfo) {
      res.status(401).json({message : '로그인을 먼저 해주세요'});
    } else {
      await User.destroy({
        where : {id : userInfo.id}
      })
      .then((_) => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err)
        res.status(403).json({message : '훼손된 토큰입니다. 다시 로그인 해주세요'});
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
  }
};
exports.kakaoResult = async (req, res) => {
  try {
    const code = req.query?.code;
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: `${process.env.KAKAO_REST_API_KEY}`,
        redirect_uri: 'http://localhost:8080/user/kakao',
        code: `${code}`,
      },
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );
    const {access_token, token_type, refresh_token, expires_in, refresh_token_expires_in} = response.data;
    const info = await axios.get('https://kapi.kakao.com/v2/user/me', 
    {
      headers : {
        'Authorization' : `${token_type} ${access_token}`,
        'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
      }
    });
    const kakaoId = info?.data?.id;
    const kakaoProperties = info?.data?.properties;
    let kakaoUser = await User.findOne({
      where : {userId : kakaoId, social : 'kakao'}
    });
    if (!kakaoUser) {
      kakaoUser = await User.create({
        userId : kakaoId,
        nickname : `${kakaoProperties.nickname}`,
        email : `${kakaoId}@kakao.com`,
        social : 'kakao',
      })
    }
    const userInfo = {};
    userInfo['id'] = kakaoUser?.id;
    userInfo['nickname'] = kakaoUser?.nickname;
    const token = jwt.sign(userInfo, process.env.SECRET_KEY);
    res.cookie('access', token, {
      maxAge : 24 * 60 * 60 * 1000,
      Path : '/'
    })
    // res.redirect(`http://localhost:3000/main`);
    res.redirect(`http://localhost:3000/main?token=${token}`);
  } catch (err) {
    console.log(err);
  }
};
// window.location.href=`https://kauth.kakao.com/oauth/authorize?redirect_uri=http://localhost:8080/user/kakao/login&client_id=${process.env.REACT_APP_KAKAO_REST_API}&response_type=code`
exports.kakaoUserRegister = async (req, res) => {
  res.send('');
};
exports.kakaoUserLogin = async (req, res) => {
  // const userInfo = {};
  // userInfo['id'] = kakaoUser?.id;
  // userInfo['nickname'] = kakaoUser?.nickname;
  // const token = jwt.sign(userInfo, process.env.SECRET_KEY);
  // res.cookie('access', token, {
  //   maxAge : 24 * 60 * 60 * 1000,
  //   Path : '/'
  // })
  // res.status(200).send({...token})
};
exports.sendKakaoData = async (req, res) => {
  res.json({kakaoId, kakaoProperties});
};