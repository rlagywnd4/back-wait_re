const Reservation = (Sequelize, DataTypes) => {
  const reservation = Sequelize.define('reservation', {
    reservationId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '예약중(true), 거래완료(마감)(false)',
    },
  });
  return reservation;
};

module.exports = Reservation;
