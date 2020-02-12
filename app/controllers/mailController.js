// Packages
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
