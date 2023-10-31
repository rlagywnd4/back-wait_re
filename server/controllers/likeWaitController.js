const { LikeWait } = require('../models');

exports.postLikeWait = async (req, res) => {
  try {
    const { wmId, proxyId } = req.body;
    const insertLikeWait = await LikeWait.create({
      proxyId: proxyId,
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
    const { wmId, proxyId } = req.query;
    const deleteLikeWait = await LikeWait.destroy({
      where: {
        wmId: wmId,
        proxyId: proxyId,
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
