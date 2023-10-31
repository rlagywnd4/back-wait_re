const jwt = require('jsonwebtoken');
const { User, Review, Proxy, WaitMate } = require('../models');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

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
      const id = decoded?.id;
      const userInfo = await User.findOne({
        where : { id },
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
};

const storage = (folderName) => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      const filePath = path.join(__dirname, `../public/${folderName}`);
      try {
        await fs.promises.mkdir(filePath, {recursive : true});

        cb(null, filePath);
      } catch (err) {
        console.log(err);
        cb(err);
      }
    },
    filename: (req, file, cb) => {
      try {
        const extname = file.mimetype.split('/')[1];
        if (extname !== 'jpeg' && extname !== 'png' && extname !== 'jpg') {
          throw Error('지원하지 않는 파일 형식입니다.');
        }
        const profileImgDir = path.join(__dirname, '../public/profileImg/')
        fs.readdir(profileImgDir, (err, files) => {
          if (err) {
            throw new Error(err)
          }
          files.forEach((file) => {
            if (file.startsWith(`${req.body.userId}.`)) {
              fs.unlink(path.join(profileImgDir, file), err => {
                if (err) throw err;
              });
            }
          })
        })
        cb(null, `${req.body.userId}.${extname}`);
      } catch (err) {
        console.log(err);
        cb(err);
      }
    }
  })
};

exports.upload = (folderName) => {
  return multer({ storage: storage(folderName) });
}
