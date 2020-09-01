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
    "alpha2": {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2,2]
      }
    },
    "alpha3": {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3,3]
      }
    },
    "countryCode": {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3,3]
      }
    },
    "iso_3166_2": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "region": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "subRegion": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "intermediateRegion": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "regionCode": {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0,3]
      }
    },
    "subRegionCode": {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0,3]
      }
    },
    "intermediateRegionCode": {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0,3]
      }
    }
  });
    
  return Country;
};
