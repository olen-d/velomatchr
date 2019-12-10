// Models
const { MatchPref } = require("../models");

exports.create_match_preferences = (req, res) => {

  const { userId, distance, gender } = req.body;
  MatchPref.create({
    userId,
    distance,
    gender
  }).then(newMatchPreferences => {
    res.json(newMatchPreferences);
  })
  .catch(err => {
    res.status(500).json({error: err});
  });
};
