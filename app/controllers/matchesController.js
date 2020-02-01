const fetch = require("node-fetch");

// Models
const { MatchPref, Relationship, User } = require("../models");

// Create or update match preferences
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

// Calculate user matches and create relationships
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
      let scores = new Map();

      const newAnswers = data[0].answers.split(",");
      const otherAnswers = data[1];

      for (let a of otherAnswers) {
        let thisAnswers = a.answers.split(",");
        let diffs = newAnswers.map((w, i) => {
          let r = Math.abs(w - thisAnswers[i]);
          return r;
        });

        // Calculate the total difference in scores
        let score = diffs.reduce((a, c) => {
          let s = a + c;
          return s;
        });
        scores.set(a.userId, score);
      }

      return scores;
    })
    .then(scores => {
      const matches = [...scores];

      fetch(`${process.env.REACT_APP_API_URL}/api/relationships/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ matches, userId })
      })
      .then(response => {
        // TODO: Fix the relationship controller to actually return the new matches
      })
      .catch(err =>{
        res.status(500).json({error: err});
      });
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
}

// Get the user's matches
exports.read_user_matches = (req, res) => {
  const userid = req.params.userid;

  Relationship.findAll({
    where: {
      requesterId: userid,
      status: 2
    },
    include: [{ 
      model: User, 
      as: "addressee",
      attributes: { exclude: ["password"]}
    }],
    order: [
      ["matchScore", "ASC"],
      ["updatedAt", "DESC"]
    ]
  })
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.send(err);
  });
};

// Get the user's match preferences
exports.read_user_matches_preferences = (req, res) => {
  const userid = req.params.userid;

  MatchPref.findOne({
    where: {
      userId: userid
    },
    attributes: ["distance", "gender"]
  })
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.send(err);
  });
};
