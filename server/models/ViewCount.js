const ViewCount = (Sequelize, DataTypes) => {
  const viewCount = Sequelize.define(
    'viewCount',
    {
      vcId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      tableName: 'viewCount',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return viewCount;
};

module.exports = ViewCount;
