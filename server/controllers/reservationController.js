const { WaitMate } = require('../models');

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
