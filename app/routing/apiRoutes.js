module.exports = (app) => {

  const multer = require("multer");

  const bcrypt = require("./../helpers/bcrypt-module");
  const db = require("./../models");

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

  app.post("/api/signup", upload.single("profilePhotographFile"), (req, res) => {
    if (!req.file) {
      return res.send({
        success: false,
        errorCode: 404,
        errorMsg: "No file was uploaded"
      });

    } else {
      const formData = req.body;

      bcrypt.newPass(formData.password).then(pwdRes => {
      if(pwdRes.status === 200) {
        db.User.create({
          name: formData.firstName + "." + formData.lastName.slice(0,1),
          password: pwdRes.passwordHash,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.emailAddress,
          phone: formData.telephoneNumber,
          photoLink: req.file.path,
          gender: formData.gender,
          latitude: formData.latitude,
          longitude: formData.longitude,
          city: "blank",
          state: "blank",
          stateCode: "blank",
          country: "blank",
          countryCode: "bla"
        }).then(newUser => {
          // res.json(newUser);
          return res.send({
            success: true,
            login: true,
            userId: newUser.id,
          });
        });
        } else {
          return res.send({
            errorCode: 500,
            errorMsg: "Internal Server Error"
          });
        }
      });
    }
  });

  app.post("/api/survey/submit", (req, res) => {
    const formData = req.body;

    const answers = Object.values(formData);

    db.Answer.create({
      // TODO: Update the userId to use the userId of the actual logged in user
      userId: 99,
      answers: answers.join()
    }).then(newAnswer => {
      return res.json(newAnswer);
    }).catch(error => {
      res.send({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  });
}
