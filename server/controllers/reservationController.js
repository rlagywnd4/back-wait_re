const { WaitMate, Proxy } = require('../models');
const Reservation = require('../models/Reservation');

exports.getWaitMateReservation = async (req, res) => {
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
  try {
    const { id } = req.query;
    let proxyList = [];
    const getWMId = await WaitMate.findAll({
      where: {
        id,
      },
    });
    getWMId.forEach(async (element) => {
      const getPickedProxy = await Reservation.findOne({
        where: {
          wmId: element.wmId,
        },
      });
      const proxy = await Proxy.findOne({
        where: {
          proxyId: element.proxyId,
        },
      });
      proxyList.push(proxy);
    });
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
