module.exports = (app) => {
    app.post("/api/signup", /*upload.single("profile_photo"),*/ (req, res) => {
        
    // if (!req.file) {
    //     console.log("No file received");
    //     return res.send({
    //       success: false
    //     });
    
    //   } else {
        // console.log('file received');
        // console.log("b",req.body);
        // console.log("f",req.file);
        const formData = req.body;
        console.log("Roman", formData);
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
    });
}
