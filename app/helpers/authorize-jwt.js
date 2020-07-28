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
        res.status(400).json({ status: 400, message: "Access token has expired" });
      }
      req.authorized = true;
      next();
    } catch (error) {
      req.authorized = false;
      res.status(403).json({ status: 403, message: `Forbidden. ${error}` });
    }
  } else {
    res.status(403).json({ status: 403, message: "Forbidden. A valid access token was not provided." });
  }
};
