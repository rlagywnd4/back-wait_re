const { WaitMate } = require('../models');

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
