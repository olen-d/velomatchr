// Packages
const dnsPromises = require("dns").promises;
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

// Helpers
const tokens = require ("../helpers/tokens");

exports.mail_match = async (req, res) => {
  // Get the items from the body
  const { body: { addresseeProxy, body: message, requesterProxy, subject }, } = req;

  const token = await tokens.create(-99);
  const errors = [];

  const isValidStringLength = (string, name) => {
    if (string.length < 2 ) {
      errors.push({ [name]: true });
      return false;
    } else {
      return true;
    }
  };

  const isValidMessage = isValidStringLength(message, "body");
  const isValidSubject = isValidStringLength(subject, "subject");

  if (isValidMessage && isValidSubject) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/email-address/${addresseeProxy}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const json = response.ok ? await response.json() : null;
      const { data: [{ requester: { email }, }], } = json;
  
      // TODO: Add something to the subject, or not
      // TODO: Filter the message
      const formData = {
        fromAddress: `"VeloMatchr Buddy" <buddy-${requesterProxy}@velomatchr.com>`, 
        toAddress: email, 
        subject, 
        message
      }
  
      const sendResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/send`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
  
      const sendJson = sendResponse.ok ? await sendResponse.json() : null;
  
      if (sendJson.status !== 200) {
        res.status(500).json(sendJson);
      } else {
        res.status(200).json({ status: 200, message: "ok" });
      }
    } catch(error) {
      res.status(500).json({ status: 500, message: "Internal Server Error", error });
    }
  } else {
    res.status(200).json({ status: 200, message: "ok", errors });
  }
};

exports.send_mail = (req, res) => {
  const { authorized } = req;
  if (authorized) {
    const { body: { fromAddress, toAddress, subject, message }, } = req;

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
        res.status(500).json({ status: 500, message: `Internal server error. ${err}` });
      } else {
        res.status(200).json({ status: 200, message: "ok", data: success });
      }
    });
  } else {
    res.sendStatus(403);
  }
};

exports.check_mx = (req, res) => {
  // const { authorized } = req; // TODO: update this to use API key when implemented

  // if (authorized) {
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
      res.status(200).json({ status:200, message: "ok", mxExists: result});
    })
    .catch(err => {
      // TODO: Deal with the error
      console.log("mailController.js Error\n" + err);
      res.status(403).json({ status: 500, message: "Internal Server Error", mxExists: false});
    });
  // } else {
  //   res.sendStatus(403);
  // }
};
