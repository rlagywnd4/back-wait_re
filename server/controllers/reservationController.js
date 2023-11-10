const { WaitMate, Proxy, Reservations } = require('../models');

exports.getWaitMateReservation = async (req, res) => {
  // get/waitMate/detail과 비슷한 기능이라 필요없지만 나중에 필요할 수 있어서 남겨둠
  try {
    const { wmId } = req.query;
    const getReservation = await WaitMate.findOne({
      where: {
        wmId,
      },
    });
    if (getReservation) {
      res.send({ result: 'success', getReservation });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

exports.getPickedWaitMate = async (req, res) => {
  try {
    const { id } = req.query;
    let waitMateList = [];
    const getProxyId = await Proxy.findOne({
      where: {
        id,
      },
    });
    const getPickedWaitMate = await Reservation.findAll({
      where: {
        proxyId: getProxyId.proxyId,
      },
    });
    getPickedWaitMate.forEach(async (element) => {
      const waitMate = await WaitMate.findOne({
        wmId: element.wmId,
      });
      waitMateList.push(waitMate);
    });
    if (getPickedWaitMate) {
      res.send({ waitMateList: waitMateList });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

exports.getPickedProxy = async (req, res) => {
  console.log('-------------');
  try {
    const { id } = req.query;
    console.log(id);
    let proxyList = [];
    const getWMId = await WaitMate.findOne({
      where: {
        id,
      },
    });
    console.log(getWMId);
    const getPickedProxy = await Reservations.findOne({
      where: {
        wmId: getWMId.wmId,
      },
    });
    const proxy = await Proxy.findOne({
      where: {
        proxyId: getWMId.proxyId,
      },
    });
    // proxyList.push(proxy);
    console.log(proxy);
    // getWMId.forEach(async (element) => {
    // });
    if (proxyList[0] !== '') {
      res.send(proxyList);
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};
