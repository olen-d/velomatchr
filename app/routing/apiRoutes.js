module.exports = (app) => {

  const multer = require("multer");
  const jwt = require("jsonwebtoken");
  const config = require("./../../config")

  const bcrypt = require("./../helpers/bcrypt-module");

  const Sequelize = require("sequelize");
  const db = require("./../models");

  // Relations
  db.User.hasOne(db.MatchPref);
  db.MatchPref.belongsTo(db.User);

  // Set Storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images-profiles")
    }, // TODO - FIX THIS TO FILTER FOR IMAGE FILES
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + "-" + file.originalname)
    }
  })
   
  const upload = multer({ storage: storage })

 
// api/matches/preferences/submit
  app.post("/api/matches/preferences/submit", (req, res) => {
    const formData = req.body;

    db.MatchPref.create({
      userId: formData.userId,
      distance: formData.distance,
      gender: formData.gender
    }).then(newMatchPreferences => {
      return res.json(newMatchPreferences);
    }).catch(error => {
      res.send({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  });
  

app.post("/api/survey/submit", (req, res) => {

  // Run the matching algorithm here, rather than in the survey component so the
  // survey form can be re-used for any type of Likert scale survey

  // Get the user's home location
  // Also pull match distance and gender preferences
  db.User.findOne({
    include: [
      {
        model: db.MatchPref
      }
    ],
    where: {id: userId},
    attributes: ["latitude", "longitude", "MatchPref.distance", "MatchPref.gender"]
  }).then(userInfo => {
    // console.log("//////////\n", userInfo);
    console.log("AAAAAAA\nLat: ", userInfo.latitude, "\nBBBBBBB\n", userInfo.longitude);
    console.log("CCCCC\nDistance:", userInfo.MatchPref.distance, "\nDDDDDD\nGender: ", userInfo.MatchPref.gender);
  }).catch({
    // TODO: provide an intelligent error message about how the user couldn't be found
    // or whatever else went wrong...
  })

  // Get the match preferences (distance and gender)
  // db.MatchPref.findOne({
  //   where: {userId: userId},
  //   attributes: ["distance", "gender"]
  // }).then(matchPrefs => {
  //   console.log("PPPPPPP\n", matchPrefs.distance,"\nZZZZZZZZ\n",matchPrefs.gender);
    
    
  // }); // TODO: Remember to catch problems


  // Retrieve userid and answers from the data

  const Op = Sequelize.Op;

  db.Answer.findAll({
    where: {
      [Op.not]: [{id: newAnswer.id}]
    },
    attributes: ["userId", "answers"]
  }).then(otherAnswers => {
    let scores = new Map();

    const newAnswers = newAnswer.answers.split(",");
    // console.log("||||| newAnswers: ", newAnswers);
    // console.log("---------\nOther Answers:\n", otherAnswers);
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
    console.log("-------------\nScores: ", scores);
  });

  // Should be data.answers
  // console.log("Answers\n", data.answers);
  // console.log("API Answers \n",newAnswer.answers);
  // Run the matching algorithm
  // Lower scores are better
  // Redirect to the matches page
  // Remember to finish the matches page
  return res.json(newAnswer);
}).catch(error => {
  res.send({
    errorCode: 500,
    errorMsg: "Internal Server Error",
    errorDetail: error
  })
});
});