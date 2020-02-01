module.exports = (sequelize, DataTypes) => {
    const MatchPref = sequelize.define("MatchPref", {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
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

    MatchPref.associate = models => {
      // Associate the User with the survey answers, used with match preferences and gender
      MatchPref.hasOne(models.Answer, {
        as: "matchPrefs",
        foreignKey: "userId"
      });
    };    

    return MatchPref;
  };
  