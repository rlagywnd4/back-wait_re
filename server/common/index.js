const jwt = require('jsonwebtoken');
const { User, Review, Proxy, WaitMate } = require('../models');
/**
 * 사용자 정보를 가져오는 함수.
 * @param {Object} req - Express의 요청 객체
 * @returns {Promise<Object>} - 사용자 정보 객체 (Promise 반환 하므로 await를 붙이기)
 * @throws {Error} - JWT 검증 오류 발생 시 빈 객체와 함께 에러를 던집니다.
 * @example
 * const Common = require('../common');
 * const userInfo = await Common.cookieUserinfo(req);
 */
exports.cookieUserinfo = async (req) => {
  const access = req?.cookies?.access;
  return new Promise(async (resolve, reject) => {
    await jwt.verify(access, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return reject({})
      }
      const id = decoded?.id
      const userInfo = await User.findOne({
        where : {id},
        attributes : ['id', 'userId', 'email', 'nickname', 'photo', 'createdAt', 'updatedAt'],
        include : [
          {model : Review},
          {model : Proxy},
          {model : WaitMate},
        ],
      })
      resolve(userInfo.dataValues)
    })
  })
}