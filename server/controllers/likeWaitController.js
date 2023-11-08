const { LikeWait, Proxy } = require('../models');

exports.postLikeWait = async (req, res) => {
  try {
    const { wmId, id } = req.body;
    const insertLikeWait = await LikeWait.create({
      id: id,
      wmId: wmId,
    });
    if (insertLikeWait) {
      res.send({ result: 'success' });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteLikeWait = async (req, res) => {
  try {
    const { wmId, id } = req.query;
    const deleteLikeWait = await LikeWait.destroy({
      where: {
        wmId: wmId,
        id: id,
      },
    });
    if (deleteLikeWait) {
      res.send({ result: 'success' });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};
