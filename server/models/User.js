const User = (Sequelize, DataTypes) => {
    const user = Sequelize.define(
      'user',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.STRING(150),
          allowNull: false,
          comment: '유저 아이디',
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
          comment: '패스워드',
        },
        nickname: {
          type: DataTypes.STRING(150),
          allowNull: false,
          comment: '닉네임',
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
          comment: '유저 이메일',
        },
        photo: {
           type: DataTypes.STRING(150),
           allowNull : true,
           comment : '사진'
        }
      },
      {
        tableName: 'user',
        freezeTableName: true,
        timestamps: true,
      }
    );
    return user;
  };
  
  module.exports = User;