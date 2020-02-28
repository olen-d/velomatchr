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
        isEmail: true
      }
    },
    isEmailVerified: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        len: [1]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photoLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
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
  },
  {
    indexes:[
      {
        unique: false,
        fields: [
          "latitude",
          "longitude"
        ]
      }
    ]
  });

  User.associate = models => {
    // Associate the User with the survey answers, used with match preferences and gender
    User.hasOne(models.Answer, {
      as: "matchCharacteristics",
      foreignKey: "userId"
    });
    // Associate the User with their match preferences
    User.hasOne(models.MatchPref, {
      as: "userMatchPrefs",
      foreignKey: "userId"
    });
    // Associating User with Relationships
    // When an User is deleted, also delete any associated Relationships
    User.hasMany(models.Relationship, {
      as: "requester",
      foreignKey: "requesterId",
      onDelete: "cascade"
    });
    // Associate the addressee with the user data
    User.hasMany(models.Relationship, {
      as: "addressee",
      foreignKey: "addresseeId",
      onDelete: "cascade"
    });

  };

  return User;
};
