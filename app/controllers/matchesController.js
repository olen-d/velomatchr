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

exports.calculate_user_matches = (req, res) => {
  const { userId, otherAnswers } = req.body;
  // Do the calculations
  // Apply the cut-off score
  // Return the list of potential matches
  // The list gets passed to the relationship controller to insert with an initial state of zero

}