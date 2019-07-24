module.exports = (sequelize, DataTypes) => {
    const MatchPreference = sequelize.define("MatchPreference", {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
            len: [1]
        }
      },
      distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      }
    });
    return MatchPreference;
  };
  