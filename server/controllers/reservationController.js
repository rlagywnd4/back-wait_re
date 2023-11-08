const { WaitMate, Proxy } = require('../models');
const Reservation = require('../models/Reservation');

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
    getPickedWaitMate.array.forEach(async (element) => {
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
