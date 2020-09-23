const imaps = require("imap-simple");

const config = {
  imap: {
    user: process.env.REL_SMTP_USER,
    password: process.env.REL_SMTP_PASS,
    host: process.env.REL_SMTP_HOST,
    port: process.env.REL_SMTP_PORT,
    tls: process.env.REL_SMTP_SECURE,
    authTimeout: 3000
  }
};

const listen = async () => {
  const searchCriteria = [
    "UNDELETED"
  ];

  const fetchOptions = {
    bodies: ["HEADER", "TEXT"],
    markSeen: false
  };

  try {
    const connection = await imaps.connect(config);

    await connection.openBox("INBOX");

    const results = await connection.search(searchCriteria, fetchOptions);
    const prts = results.map(r => {
      return r.parts.filter(p => {
        return p.which === "HEADER";
      })[0].body.to[0];
    })
console.log("RESULTS\n", prts, "\n");
    const subjects = results.map(res => {
      return res.parts.filter(part => {
        return part.which === "HEADER";
      })[0].body.subject[0];
    });
    console.log("SUBJECTS:\n" + subjects);
    // return subjects;
  } catch(error) {
    console.log("matchMail.listen // ERROR:\n" + error);
  }
};

const forward = async () => {
  // To
  // Split out the UUID
  // Look up the addresee's email address by UUID
  // Look up the addresse's userId by email address
  // From
  // Get the from userId by email address
  // Get the sender's email proxy
  // Build the reply buddy-sender-email-proxy@velomatchr.com
  // Subject
  // Body
  // Send the email
};

module.exports = {
  listen
}
