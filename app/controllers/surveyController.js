const Sequelize = require("sequelize");

// Models
const { Answer } = require("../models");

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

exports.read_survey_response_except = (req, res) => {
  const userId = req.params.userid;

  Answer.findAll({
    where: {
      [Op.not]: [{userId}]
    },
    attributes: ["userId", "answers"]
  }).then(otherAnswers => {
    res.json(otherAnswers);
  })
  .catch(err => {
    res.status(500).json({error: err});
  });
}
