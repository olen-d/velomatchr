module.exports = (app) => {

  const multer = require("multer");

  const bcrypt = require("./../helpers/bcrypt-module");
  const db = require("./../models");

  // Set Storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images-profiles")
    }, // TODO - FIX THIS TO FILTER FOR IMAGE FILES
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + "-" + file.originalname)
    }
  })
   
  const upload = multer({ storage: storage })

  app.post("/api/signup", upload.single("profilePhotographFile"), (req, res) => {
    // console.log("*********\n", req);
    // console.log("+++++++++\n", req.body);
    // console.log("=========\n", req.file);
      
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });

    } else {
      console.log('file received');
      console.log("b\n",req.body);
      console.log("f\n",req.file);
      const formData = req.body;
    
      // console.log("Roman\n", formData);
      bcrypt.newPass(formData.password).then(function(pwdRes) {
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
          res.json(newUser);
        });
        } else {
          throw error;
        }
      });
      return res.send({
        success: true,
        data: req.body
      })
    }
  });
}
