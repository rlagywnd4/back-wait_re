const LikeWait = (Sequelize, DataTypes) => {
    const likeWait = Sequelize.define(
      'likeWait',
      {
        likeId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        wmId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '웨이트 메이트 아이디',
        },
        id : {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '유저 아이디',
        }
      },
      {
        tableName: 'likeWait',
        freezeTableName: true,
        timestamps: true,
      }
    );
    return likeWait;
  };
  
  module.exports = LikeWait;