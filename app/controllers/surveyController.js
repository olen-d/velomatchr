const fetch = require("node-fetch");
const Sequelize = require("sequelize");

// Models
const { Answer, MatchPref, User } = require("../models");

const Op = Sequelize.Op;

exports.update_survey_response = (req, res) => {
  const formData = req.body;
  const userId = formData.userId;

  delete formData.userId;

  const answers = Object.values(formData);

  Answer.upsert({
    userId: userId,
    answers: answers.join()
  }).then(newAnswer => {
    res.json(newAnswer);
  })
  .catch(err => {
    res.status(500).json({error: err});
  });
};

exports.read_survey_response = (req, res) => {
  const userId = req.params.userid;

  Answer.findOne({
    where: {
      userId: userId
    }
  }).then(userAnswers => {
    res.json(userAnswers);
  })
  .catch(err => {
    res.status(500).json({error: err})
  });
};

exports.read_survey_response_except = (req, res) => {
  const userId = req.params.userid;

  fetch(`${process.env.REACT_APP_API_URL}/api/users/matches/preferences/${userId}`)
  .then(response => {
    return response.ok ? response.json() : new Error(response.statusText); 
  })
  .then(json => {
    const { user: { gender, userMatchPrefs: { distance, gender: matchGenderPref }, }, } = json; // Nested destructuring. Returns distance and gender. Pretty dope.

    console.log("DISTANCE:\n", distance, "\nGENDER PREF\n", matchGenderPref, "\nuserGender\n", gender);
    // if(gender === "any") {
    //   const whereClause = `[Op.or]: [{"$matchPrefs.gender$": "any"}, {"$matchPrefs.gender$": "same". }]`;
    //   readAnswersByPrefs(distance, gender);
    // }
  })
  .catch(err => {
    // TODO: do something about the error
    console.log("surveyController.js ~59 - Error:", err);
  })

  // Match preference of user is same
  // Need gender of user
  // Need gender of matches
  // Match only other users with the same gender

  
  // Match preference of user is any
  // Match other users with preference of any or preference of same && user gender === match gender

  // Need the match preference of the potential matches
  const readAnswersByPrefs = (distance, gender) => {
    const genderMatch = gender;

    Answer.findAll({
      where: {
        [Op.not]: [{userId}]
      },
      attributes: ["userId", "answers"],
      include: [
        {
          model: User,
          as: "matchCharacteristics",
          attributes: ["gender", "latitude", "longitude"]
        },
        {
          model: MatchPref,
          as: "matchPrefs",
          attributes: ["distance", "gender"]
        }
      ]
    }).then(otherAnswers => {
      res.json(otherAnswers);
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
  }
};
