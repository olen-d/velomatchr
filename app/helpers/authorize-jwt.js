const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.slice(7) : false;
  const secret = process.env.SECRET;

  if (token) {
    try {
      const decoded = jwt.verify(token, secret);
      const { exp } = decoded;

      if(exp <= (Math.floor(Date.now() / 1000))) {
        res.end("Access token has expired", 400);
      }
      req.authorized = true;
      next();
    } catch (error) {
      req.authorized = false;
      return next();
    }
  } else {
    res.status(403).send("Forbidden. A valid access token was not provided.");
    next();
  }
};
