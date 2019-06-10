module.exports = (app) => {

  const multer = require("multer");

  // Set Storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images-profiles")
    }, // TODO - FIX THIS TO FILTER FOR IMAGE FILES AND ALSO ADD THE CORRECT EXTENSION
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
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
    console.log("Roman\n", formData);
    // bcrypt.newPass(formData.password).then(function(pwdRes) {
    // if(pwdRes.status == 200) {
    //     db.User.create({
    //         name: formData.user_name,
    //         password: pwdRes.passwordHash,
    //         firstName: formData.first_name,
    //         lastName: formData.last_name,
    //         email: formData.email,
    //         phone: formData.phone,
    //         photoLink: req.file.path,
    //         gender: formData.gender,
    //         city: "blank",
    //         state: "blank",
    //         stateCode: "blank",
    //         country: "blank",
    //         countryCode: "bla"
    //     }).then(newUser => {
    //     res.json(newUser);
    //     });
    //     } else {
    //         throw error;
    //     }
    // });
    // return res.send({
    //   success: true,
    //   data: req.body
    // })
    }
  });
}
