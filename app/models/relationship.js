module.exports = (sequelize, DataTypes) => {
  const Relationship = sequelize.define("Relationship", {
    requesterId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      validate: {
          len: [1]
      }
    },
    addresseeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      validate: {
          len: [1]
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    actionUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
          len: [1]
      }
    }
  });
  return Relationship;
};
  