module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define("RefreshToken", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
          len: [1]
      }
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIP: true
      }
    }
  });
  return RefreshToken;
}