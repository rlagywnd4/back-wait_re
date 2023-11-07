const path = require('path'); //경로에 관한 내장 모듈
const { Op, fn, col } = require('sequelize');
const { WaitMate, ChatRoom, LikeWait, Proxy, ViewCount } = require('../models');

// waitMateDetail 조회
exports.getWaitMateDetail = async (req, res) => {
  // wmAddress를 요청에 받고 응답 값에는 id(user)를 보내 글쓴 주인인지 확인(waitMate에 포함됨)
  try {
    let isLikeWait = false;
    const { wmId, proxyId } = req.query;
    // WaitMateDetail페이지
    const waitMate = await WaitMate.findOne({
      where: {
        wmId,
      },
    });

    // 조회수 증가
    waitMate.count += 1;
    const patchWaitMateCount = await WaitMate.update(
      {
        count: waitMate.count,
      },
      {
        where: {
          wmId: wmId,
        },
      }
    );

    //프록시 아이디가 있으면
    if (proxyId) {
      // 찜을 했는지 체크
      const likeWait = await LikeWait.findOne({
        where: {
          wmId: wmId,
          proxyId: proxyId,
        },
      });

      if (likeWait) {
        isLikeWait = true;
      }
    }
    //최근 채용 횟수(6개월전 ~ 현재)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentHiresCount = await WaitMate.findAll({
      attributes: [[fn('COUNT', col('*')), 'rowCount']],
      where: {
        id: waitMate.id,
        updatedAt: {
          [Op.between]: [sixMonthsAgo, new Date()],
        },
      },
      raw: true,
    }); // 실행 결과(예시): [ { rowCount: 8 } ]

    // 지원자수
    const waitMateApply = await ChatRoom.findAll({
      attributes: [[fn('COUNT', col('*')), 'rowCount']],
      where: {
        wmId: wmId,
      },
      raw: true,
    });

    res.send({
      waitMate: waitMate,
      recentHiresCount: recentHiresCount[0].rowCount,
      waitMateApplyCount: waitMateApply[0].rowCount,
      isLikeWait: isLikeWait,
    });
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate를 DB에 등록
exports.postWaitMate = async (req, res) => {
  console.log('-----------------------');
  try {
    const {
      id,
      title,
      wmAddress,
      wmDetailAddress,
      lng,
      lat,
      waitTime,
      description,
      pay,
    } = req.body; //photo가 파일 자체가 날라옴
    let photo;
    if (!req.file) {
      // photo경로 나중에 서버올리면 바꿔야함
      photo =
        'C:\\Users\\user\\Documents\\back-wait\\server\\public\\profileImg\\default.png';
    } else {
      photo = req.file.filename;
    }
    // DB에 waitMate 등록
    const insertWaitMate = await WaitMate.create({
      id: id,
      title: title,
      wmAddress: wmAddress,
      wmDetailAddress: wmDetailAddress,
      lng: lng,
      lat: lat,
      waitTime: waitTime,
      description: description,
      pay: pay,
      // photo경로 나중에 서버올리면 바꿔야함
      // photo: path.join(__dirname, '../public/waitMateImg', req.file.filename),
      photo: photo,
    });
    if (insertWaitMate) {
      res.send({ result: 'success' });
    } else {
      console.log(insertWaitMate);
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate 삭제
exports.deleteWaitMate = async (req, res) => {
  try {
    const { wmId, id } = req.query;
    const deleteWaitMate = await WaitMate.destroy({
      where: {
        wmId: wmId,
        id: id,
      },
    });
    if (deleteWaitMate) {
      res.send({ result: 'success' });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate 수정
exports.patchWaitMate = async (req, res) => {
  try {
    const {
      wmId,
      title,
      wmAddress,
      wmDetailAddress,
      lng,
      lat,
      waitTime,
      description,
      pay,
    } = req.body;

    let isSuccess;
    // 사진이 있으면
    if (req.file) {
      const patchWaitMate = await WaitMate.update(
        {
          title: title,
          wmAddress: wmAddress,
          waitTime: waitTime,
          wmDetailAddress: wmDetailAddress,
          lng: lng,
          lat: lat,
          description: description,
          pay: pay,
          photo: req.file.filename,
        },
        {
          where: {
            wmId: wmId,
          },
        }
      );
      if (patchWaitMate) {
        isSuccess = true;
      }
    } else {
      // 사진이 없을때
      const patchWaitMate = await WaitMate.update(
        {
          title: title,
          wmAddress: wmAddress,
          wmDetailAddress: wmDetailAddress,
          lng: lng,
          lat: lat,
          waitTime: waitTime,
          description: description,
          pay: pay,
        },
        {
          where: {
            wmId: wmId,
          },
        }
      );
      if (patchWaitMate) {
        isSuccess = true;
      }
    }
    if (isSuccess) {
      res.send({ result: 'success' });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate목록 조회
exports.getWaitMateList = async (req, res) => {
  try {
    let { wmAddress, order } = req.query;
    console.log(req.query);
    if (wmAddress) {
      const waitMates = await WaitMate.findAll({
        where: {
          wmAddress: {
            [Op.like]: `%${wmAddress}%`,
          },
        },
        order: [[order, 'DESC']],
      });
      res.send({
        waitMates: waitMates,
      });
    } else {
      const waitMates = await WaitMate.findAll({ order: [[order, 'DESC']] });
      res.send({
        waitMates: waitMates,
      });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

exports.getWaitMateMapList = async (req, res) => {
  try {
    const getWaitMateMapList = await WaitMate.findAll();
    res.send(getWaitMateMapList);
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};
