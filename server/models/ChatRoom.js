const ChatRoom = (Sequelize, DataTypes) => {
    const chatRoom = Sequelize.define(
      'chatRoom',
      {
        chatId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        wmId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '웨이트메이트 아이디',
        },
        proxyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '프록시 아이디',
        }
      },
      {
        tableName: 'chatRoom',
        freezeTableName: true,
        timestamps: true,
      }
    );
    return chatRoom;
  };
  
  module.exports = ChatRoom;