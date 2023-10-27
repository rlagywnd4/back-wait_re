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
          allowNull : true,
          comment: '유저 아이디',
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull : true,
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
        },
        social : {
          type: DataTypes.STRING(150),
          allowNull : false,
          defaultValue : 'general',
          comment : '소셜 로그인 구분을 위한 필드'
        },
        score : {
          type: DataTypes.FLOAT,
          defaultValue : 0,
          comment : '사용자가 지금까지 받았던 점수'
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