// Models
const { Answer } = require("../models");

exports.create_survey_response = (req, res) => {
  const formData = req.body;
  const userId = formData.userId;

  delete formData.userId;

  const answers = Object.values(formData);

  Answer.create({
    userId: userId,
    answers: answers.join()
  }).then(newAnswer => {
    res.json(newAnswer);
  })
  .catch(err => {
    res.status(500).json({error: err});
  });
};
