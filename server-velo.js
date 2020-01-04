require("dotenv").config();

const express = require("express");
const app = express();

const port =  process.env.PORT || 5000;

// Comment out when syncing not needed.
const db = require("./app/models");

// TODO: consider using CORS instead...
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up the routes
// app.get("/api/express_backend", (req, res) => {
//     res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
//   });
// const apiRoutes = require("./app/routing/apiRoutes")(app);
// const htmlRoutes = require("./app/routing/htmlRoutes")(app);
app.use("/api", require("./app/routes/matches"));
app.use("/api", require("./app/routes/survey"));
app.use("/api", require("./app/routes/users"));

// db.sequelize.sync({ force: true }).then(function() {
  db.sequelize.sync().then(function() {
    app.listen(port, () => console.log(`VeloMatchr API is listening on port ${port}!`));
  });
// });

// app.listen(port, () => console.log(`VeloMatchr API is listening on port ${port}!`));
