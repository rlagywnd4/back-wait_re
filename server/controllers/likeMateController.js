const { LikeWait } = require('../models');

exports.postLikeWait = async (req, res) => {
  try {
    const { wmId, proxyId } = req.body;
    const likeWait = await LikeWait.create({
      wmId: wmId,
      proxyId: proxyId,
    });
    res.status(200).send({ result: 'success' });
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteLikeWait = async (req, res) => {
  try {
    const { wmId, proxyId } = req.body;
    const deleteLikeWait = await LikeWait.destroy({
      where: {
        wmId: wmId,
        proxyId: proxyId,
      },
    });
    res.status(200).send({ result: 'success' });
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};
