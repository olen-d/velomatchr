// Packages
const dnsPromises = require("dns").promises;
const nodemailer = require("nodemailer");

exports.send_mail = (req, res) => {
  const { fromAddress, toAddress, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMPT_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `${fromAddress}`,
    to: `${toAddress}`,
    subject: `[VELOMATCHR] ${subject}`,
    html: `${message}`
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json(success);
    }
  });
};

exports.check_mx = (req, res) => {
  const { email } = req.params;
  
  const mxExists = emailAddress => {
    return new Promise ((resolve, reject) => {
      const hostname = emailAddress.split("@")[1];
  
      try {
        dnsPromises.resolveMx(hostname).then(addresses => {
          if (addresses && addresses.length > 0) {
            addresses[0].exchange ? resolve(true) : resolve(false);
          }
        })
        .catch(err => {
          // TODO: Deal with the error
          console.log("mailController.js - resolveMx ERROR:\n" + err);
          resolve(false);        
        });
      } catch (err) {
        // TODO: Deal with the error
        console.log("mailController.js ERROR:\n" + err);
        reject(false);
      }
    });
  }

  mxExists(email).then(result => {
    res.json({mxExists: result});
  })
  .catch(err => {
    // TODO: Deal with the error
    console.log("mailController.js Error\n" + err);
    res.json({mxExists: false});
  });
};
