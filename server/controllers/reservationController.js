const { WaitMate } = require('../models');

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
