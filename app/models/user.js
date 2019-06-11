module.exports = function(sequelize, DataTypes) {
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
        allowNull: false,
    },
    photoLink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stateCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});
  return User;
};
