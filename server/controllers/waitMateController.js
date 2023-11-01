const path = require('path'); //경로에 관한 내장 모듈
const { Op, fn, col } = require('sequelize');
const { WaitMate, ChatRoom, ViewCount } = require('../models');

// waitMateDetail 조회
exports.getWaitMateDetail = async (req, res) => {
  // wmAddress를 요청에 받고 응답 값에는 id(user)를 보내 글쓴 주인인지 확인
  try {
    const { wmId, id } = req.query;
    // WaitMateDetail페이지
    const waitMate = await WaitMate.findOne({
      where: {
        wmId,
      },
    });

    // 조회수db에서 id가 같은 것이 있는지 확인 없으면 추가
    const isSameId = await ViewCount.findOrCreate({
      where: {
        id: id,
        wmId: wmId,
      },
      defaults: { id: id, wmId: wmId },
    });
    // 조회수db에서 wmId기준으로 모든 데이터 수를 가져옴
    const viewCount = await ViewCount.findAll({
      attributes: [[fn('COUNT', col('*')), 'rowCount']],
      where: {
        wmId: wmId,
      },
      raw: true,
    });

    // id추가시 db에 조회수 업데이트
    if (isSameId[isSameId.length - 1]) {
      const patchWaitMateCount = await WaitMate.update(
        {
          count: viewCount[0].rowCount,
        },
        {
          where: {
            wmId: wmId,
          },
        }
      );
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
      viewCount: viewCount[0].rowCount,
    });
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate를 DB에 등록
exports.postWaitMate = async (req, res) => {
  try {
    const { id, title, wmAddress, waitTime, description, pay, photo } =
      req.body;
    console.log('filename=', req.file.filename);
    // DB에 waitMate 등록
    const insertWaitMate = await WaitMate.create({
      id: id,
      title: title,
      wmAddress: wmAddress,
      waitTime: waitTime,
      description: description,
      pay: pay,
      // photo: path.join(__dirname, '../public/waitMateImg', req.file.filename),
      photo: req.file.filename,
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
    const { wmId } = req.query;
    const deleteWaitMate = await WaitMate.destroy({
      where: {
        wmId: wmId,
      },
    });
    const deleteViewCount = await ViewCount.destroy({
      where: {
        wmId: wmId,
      },
    });
    res.send({ result: 'success' });
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate 수정
exports.patchWaitMate = async (req, res) => {
  try {
    const { wmId, title, wmAddress, waitTime, description, pay, photo } =
      req.body;
    const patchWaitMate = await WaitMate.update(
      {
        title: title,
        wmAddress: wmAddress,
        waitTime: waitTime,
        description: description,
        pay: pay,
        photo: photo,
      },
      {
        where: {
          wmId: wmId,
        },
      }
    );
    res.send({ result: 'success' });
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate목록 조회
// 페이지네이션 구현
// 이전, 다음 기능도 구현 option = {prev || next}
exports.getWaitMateList = async (req, res) => {
  // 고려할 점: 프론트에서 페이지네이션 구현 예정
  // 조회순, 시급순, 최신순
  // 페이지네이션 고려한 설계
  // 필요한 데이터:
  // 페이지, 우선순위, 주소
  // 로직:
  // 주소를 기준으로 우선순위에 따라
  // 웨메 목록을 모두 불러옴
  // 페이지에 해당하는 컨텐츠, 현재 페이지, 우선순위를 내보냄
  // 리턴 값:
  // 한 페이지에 보여주고자하는 컨텐츠, 한 페이지에 보여주고자하는 첫 페이지의 값(숫자), 마지막 페이지의 값(숫자)
  try {
    // order는 updatedAt(최신순), pay(시급순), count(조회수) 셋중 하나
    // option은 이전, 다음 버튼을 눌렀을 경우
    let { wmAddress, order, pageNum, option } = req.query;
    const waitMateCountPerPage = 4; // 한 페이지에 보여줄 컨텐츠 개수
    const pageCountPerPage = 5; // 한 페이지에 보여줄 페이지 개수
    console.log(req.query);
    const waitMates = await WaitMate.findAll({
      where: {
        wmAddress,
      },
      order: [[order, 'DESC']],
    });

    const allWaitMateLength = waitMates.length; // 컨텐츠 개수
    const allPageLength = Math.ceil(allWaitMateLength / waitMateCountPerPage); // 총 페이지 수
    const pageGroup = Math.ceil(pageNum / pageCountPerPage); //화면에 보여질 페이지 그룹

    switch (option) {
      case 'next':
        if (pageNum + 5 > allPageLength) {
          pageNum = allPageLength;
        } else {
          pageNum += pageCountPerPage;
        }
        break;
      case 'prev':
        if (pageNum - 5 <= 0) {
          pageNum = 1;
        } else {
          pageNum -= pageCountPerPage;
        }
        break;
      default:
        break;
    }
    let lastPageNum; // 어떤 한 페이지 그룹의 마지막 페이지 번호
    let lastWaitMateNum; // 화면에 보여질 마지막 컨텐츠
    // 어떤 한 페이지 그룹의 첫 페이지 번호
    const firstPageNum = (pageGroup - 1) * waitMateCountPerPage + 1;
    // 어떤 한 페이지 그룹의 마지막 페이지 번호
    if (pageGroup * waitMateCountPerPage > allPageLength) {
      lastPageNum = allPageLength;
    } else {
      lastPageNum = pageGroup * pageCountPerPage;
    }
    const resWaitMates = []; // 응답에 보낼 컨텐츠
    const firstWaitMateNum = waitMateCountPerPage * (pageNum - 1) + 1; // 화면에 보여질 첫 컨텐츠(순서)(숫자임)
    // 화면에 보여질 마지막 컨텐츠
    if (pageNum * waitMateCountPerPage > allWaitMateLength) {
      lastWaitMateNum = allWaitMateLength;
    } else {
      lastWaitMateNum = pageNum * waitMateCountPerPage;
    }
    for (let i = firstWaitMateNum - 1; i < lastWaitMateNum; i++) {
      resWaitMates.push(waitMates[i]);
    }
    // 한 페이지에 보여주고자하는 컨텐츠, 어떤 한 페이지 그룹의 첫 페이지의 값(숫자), 마지막 페이지의 값(숫자)
    res.send({
      waitMates: resWaitMates,
      firstPageNum: firstPageNum,
      lastPageNum: lastPageNum,
    });
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};
