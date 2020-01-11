module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
          len: [1]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1]
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    photoLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10,8),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: -90, max: 90
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(11,8),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: -180, max: 180
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stateCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  User.associate = models => {
    // Associating User with Relationships
    // When an User is deleted, also delete any associated Relationships
    User.hasMany(models.Relationship, {
      as: "requester",
      foreignKey: "requesterId",
      onDelete: "cascade"
    });
    User.hasMany(models.Relationship, {
      as: "addressee",
      foreignKey: "addresseeId",
      onDelete: "cascade"
    });
  };

  return User;
};
