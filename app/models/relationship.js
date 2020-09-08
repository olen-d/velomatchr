module.exports = (sequelize, DataTypes) => {
  const Relationship = sequelize.define("Relationship", {
    requesterId: {
      type: DataTypes.INTEGER,
      unique: "pairIndex",
      allowNull: false,
      validate: {
          len: [1]
      }
    },
    addresseeId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    emailProxy: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1]
      }
    }
  });

  Relationship.associate = models => {
    // A Relationship can't be created without an User due to the foreign key constraint
    Relationship.belongsTo(models.User, {
      as: "requester",
      foreignKey: "requesterId"
    });
    Relationship.belongsTo(models.User, {
      as: "addressee",
      foreignKey: "addresseeId"
    });
  };

  return Relationship;
};
  