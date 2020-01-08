// Models
const { MatchPref } = require("../models");

exports.update_match_preferences = (req, res) => {

  const { userId, distance, gender } = req.body;
  MatchPref.upsert({
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
