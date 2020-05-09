module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define("Country", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1]
      }
    },
    "alpha-2": {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2,2]
      }
    },
    "alpha-3": {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3,3]
      }
    },
    "country-code": {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true
      }
    },
    "iso_3166-2": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "region": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "sub-region": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "intermediate-region": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "region-code": {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isNumeric: true,
        len: [0,3]
      }
    },
    "sub-region-code": {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isNumeric: true,
        len: [0,3]
      }
    },
    "intermediate-region-code": {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isNumeric: true,
        len: [0,3]
      }
    }
  },
  {
    indexes:[
      {
        unique: true,
        fields: [
          "name", "alpha-2", "alpha-3", "country-code"
        ]
      }
    ]
  });
    
  return Country;
};
