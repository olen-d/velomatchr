const fetch = require("node-fetch");

const logger = require("../utilities/logger");

const mapquestApiKey = process.env.MAPQUEST_API_KEY;
const mapquestApiURL = process.env.MAPQUEST_API_URL;

const reverseGeocode = (lat, lng) => {
  return new Promise((resolve, reject) => {
    try {
      fetch(`${mapquestApiURL}/reverse?key=${mapquestApiKey}&location=${lat},${lng}&thumbMaps=false&includeRoadMetadata=false&includeNearestIntersection=false`)
        .then(response => {
          logger.info("server.helper.reverse-geocode Success");
          resolve(response);
        })
        .catch(error =>{
          logger.error(`server.helper.reverse-geocode ${error}`);
          resolve({
            status: 500,
            message: "Internal Server Error",
            error
          });
        });
    } catch (error) {
      logger.error(`server.helper.reverse.geocode ${error}`);
      reject({
        status: 500,
        message: "Internal Server Error",
        error
      });
    }
  });
}

module.exports = {
  reverseGeocode
};
