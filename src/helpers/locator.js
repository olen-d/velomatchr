const getPosition = () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      function success (position) {
        const { coords: { latitude, longitude}, } = position;

        resolve({
          status: 200,
          latitude,
          longitude
        });
      }

      function error () {
        reject({
          status: 403,
          error: "Forbidden. User did not allow location access."
        });
      }
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      reject({
        status: 404,
        error: "Not Found. Browser does not support location access."
      })
    }
  });
};

module.exports = { getPosition }
