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

  // Need the match preference of the user

  // Match preference of user is same
  // Need gender of user
  // Need gender of matches
  // Match only other users with the same gender

  
  // Match preference of user is any
  // Match other users with preference of any

  // Need the match preference of the potential matches

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
};
