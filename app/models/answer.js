module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define("Answer", {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
            len: [1]
        }
      },
      answers: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      }
    });

    Answer.associate = models => {
      Answer.belongsTo(models.User, {
        as: "matchCharacteristics",
        foreignKey: "userId"
      });
      Answer.belongsTo(models.MatchPref, {
        as: "matchPrefs",
        foreignKey: "userId",
        targetKey: "userId" // Overrides the default of id on the MatchPref table
      });
    };

    return Answer;
  };
  