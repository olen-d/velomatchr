const fetch = require("node-fetch");

const mapquestApiKey = process.env.MAPQUEST_API_KEY;
const mapquestApiURL = process.env.MAPQUEST_API_URL;

const reverseGeocode = (lat, lng) => {
  return new Promise((res, rej) => {
    try {
      fetch(`${mapquestApiURL}/reverse?key=${mapquestApiKey}&location=${lat},${lng}&thumbMaps=false&includeRoadMetadata=false&includeNearestIntersection=false`)
        .then(response => {
          res(response);
        })
        .catch(err =>{
          res.status(500).json({error: err});
        });
    } catch (err) {
      rej({
        status: 500,
        login: false,
        error: "Internal server error. Failed to reverse geocode. " + err
      });
    }
  });
}

module.exports = {
  reverseGeocode
};
