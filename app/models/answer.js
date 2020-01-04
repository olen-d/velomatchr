module.exports = (sequelize, DataTypes) => {
    const Answer = sequelize.define("Answer", {
      userId: {
        type: DataTypes.BIGINT,
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
    return Answer;
  };
  