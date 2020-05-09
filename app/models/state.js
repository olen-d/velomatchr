module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define("State", {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2,2]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  },
  {
    indexes:[
      {
        unique: true,
        fields: [
          "code",
        ]
      }
    ]
  });
    
  return State;
};
    