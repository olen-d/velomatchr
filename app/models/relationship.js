module.exports = (sequelize, DataTypes) => {
  const Relationship = sequelize.define("Relationship", {
    // pair: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    //   unique: true,
    //   validate: {
    //     len: [1]
    //   }
    // },
    requesterId: {
      type: DataTypes.BIGINT,
      unique: "pairIndex",
      allowNull: false,
      validate: {
          len: [1]
      }
    },
    addresseeId: {
      type: DataTypes.BIGINT,
      unique: "pairIndex",
      allowNull: false,
      validate: {
          len: [1]
      }
    },
    matchScore: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        lent: [1]
      }
    },
    status: {
      type: DataTypes.INTEGER,
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
  