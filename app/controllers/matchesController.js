const fetch = require("node-fetch");

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
  const { userId } = req.body;

  const urls = [
    `${process.env.REACT_APP_API_URL}/api/survey/user/${userId}`,
    `${process.env.REACT_APP_API_URL}/api/survey/except/${userId}`
  ];

  Promise.all(urls.map(url =>
    fetch(url)
    .then(response => {
      return response.ok ? Promise.resolve(response) : Promise.reject(new Error(response.statusText)); 
    })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      // Do something about the error
      console.log("ERROR:\n", err);
    })
    )).then(data => {
      // console.log("DATA:\n", data[1]);
      // Do the calculations
      let scores = new Map();


      const newAnswers = data[0].answers.split(",");
      // console.log("||||| newAnswers: ", newAnswers);
      // console.log("---------\nOther Answers:\n", otherAnswers);
      const otherAnswers = data[1];
      for (let a of otherAnswers) {
        let thisAnswers = a.answers.split(",");
        let diffs = newAnswers.map((w, i) => {
          let r = Math.abs(w - thisAnswers[i]);
          // console.log(thisAnswers[i]);
          return r;
        });

        // Calculate the total difference in scores
        let score = diffs.reduce((a, c) => {
          let s = a + c;
          return s;
        });
      
        scores.set(a.userId, score);
        // console.log("/// Testing: ", a.userId, " ", a.answers);
      }
      // console.log("-------------\nScores: ", scores);
      // Apply the cut-off score
      // Return the list of potential matches
      // The list gets passed to the relationship controller to insert with an initial state of zero
    });
    // TODO: Add catch block to handle errors
}
