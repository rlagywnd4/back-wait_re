const { WaitMate } = require('../models');

// waitMate 조회(waitMateDetail페이지에서 사용)
exports.getWaitMate = async (req, res) => {
  // wmAddress를 요청에 받고 응답 값에는 id(user)를 보내 글쓴 주인인지 확인
  try {
    const { wmId } = req.query;
    const waitMate = await WaitMate.findOne({
      where: {
        wmId,
      },
    });

    res.json(waitMate);
  } catch (e) {
    console.error('Error fetching WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate목록 조회
exports.getWaitMateList = async (req, res) => {
  try {
    const { wmAddress } = req.query;
    console.log(req.query);
    const waitMates = await WaitMate.findAll({
      where: {
        wmAddress,
      },
    });

    res.json(waitMates);
  } catch (e) {
    console.error('Error fetching WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate를 DB에 등록
exports.postWaitMate = async (req, res) => {
  try {
    const { id, title, wmAddress, waitTime, description, pay, photo } =
      req.body;
    // DB에 waitMate 등록
    const insertWaitMate = await WaitMate.create({
      id: id,
      title: title,
      wmAddress: wmAddress,
      waitTime: waitTime,
      description: description,
      pay: pay,
      photo: photo,
    });
    if (insertWaitMate) {
      res.send({ result: 'success' });
    } else {
      console.log(insertWaitMate);
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.log('error:', e);
  }
};
