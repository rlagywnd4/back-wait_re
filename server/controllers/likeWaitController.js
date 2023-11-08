const { LikeWait, Proxy } = require('../models');

exports.postLikeWait = async (req, res) => {
  try {
    const { wmId, id } = req.body;
    const findProxy = await Proxy.findOne({
      where: {
        id,
      },
    });
    if (!findProxy) {
      res.send('cannot find Proxy');
    }
    const insertLikeWait = await LikeWait.create({
      proxyId: findProxy.proxyId,
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
    const findProxy = await Proxy.findOne({
      where: {
        id,
      },
    });
    if (!findProxy) {
      res.send('cannot find Proxy');
    }
    const deleteLikeWait = await LikeWait.destroy({
      where: {
        wmId: wmId,
        proxyId: findProxy.proxyId,
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
