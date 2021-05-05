const fetch = require("node-fetch");

const mapquestApiKey = process.env.REACT_APP_MAPQUEST_API_KEY;
const mapquestApiURL = process.env.REACT_APP_MAPQUEST_API_URL;

const forwardGeocode = (address, city, country, postalCode, stateCode, street, unit) => {
  const unitProcessed = unit ? `UNIT ${unit}` : "";
  // const location = `${address}+${street}${unitProcessed}+${city},${state}+${country}+${postalCode}`
  const location = `${city},${stateCode}+${country}+${postalCode}`

  return new Promise((resolve, reject) => {
    try {
      fetch(`${mapquestApiURL}/address?key=${mapquestApiKey}&location=${location}&thumbMaps=false`)
        .then(response => {
          resolve(response);
        })
        .catch(error =>{
          resolve({
            status: 500,
            message: "Internal Server Error",
            error
          });
        });
    } catch (error) {
      reject({
        status: 500,
        message: "Internal Server Error",
        error
      });
    }
  });
}

module.exports = {
  forwardGeocode
};
