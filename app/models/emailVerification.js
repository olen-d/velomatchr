module.exports = (sequelize, DataTypes) => {
    const EmailVerification = sequelize.define("EmailVerification", {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        validate: {
            len: [1]
        }
      },
      verificationCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
        validate: {
          len: [1]
        }
      }
    }); 

    return EmailVerification;
  };
  