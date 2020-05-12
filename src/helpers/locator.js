const locator = () => {
  return new Promise((res, rej) => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          res({
            status: 200,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        });
      } else {
        res({
          status: 403,
          error: "Forbidden. User did not allow location access."
        })
      }
    } catch (err) {
      rej({
        status: 500,
        error: "Internal server error. Failed to get latitude and longitude of user."
      });
    }
  });
};

module.exports = { locator }
