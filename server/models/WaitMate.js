const WaitMate = (Sequelize, DataTypes) => {
  const waitMate = Sequelize.define(
    'waitMate',
    {
      wmId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '구인글 제목',
      },
      wmAddress: {
        type: DataTypes.STRING(250),
        allowNull: false,
        comment: '웨이트메이트가 원하는 장소',
      },
      wmDetailAddress: {
        type: DataTypes.STRING(250),
        allowNull: false,
        comment: '웨이트메이트가 원하는 장소의 상세주소',
      },
      lng: {
        type: DataTypes.STRING(250),
        allowNull: false,
        comment: '경도',
      },
      lat: {
        type: DataTypes.STRING(250),
        allowNull: false,
        comment: '위도',
      },
      waitTime: {
        type: DataTypes.STRING(250),
        allowNull: false,
        comment: '기다려야 하는 시간',
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: '장소들에 대한 설명',
      },
      pay: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '결제 요금',
      },
      photo: {
        type: DataTypes.STRING(150),
        allowNull: true,
        comment: '사진',
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '조회수',
      },
      state: {
        type: DataTypes.STRING(150),
        defaultValue: 'active',
        comment: '상태(예약중(reserved), 거래완료(completed))',
      },
    },
    {
      tableName: 'waitMate',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return waitMate;
};

module.exports = WaitMate;
