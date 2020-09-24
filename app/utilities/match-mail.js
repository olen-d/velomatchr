const imaps = require("imap-simple");


const processNewMail = async numNewMail => {
  console.log("NUMBER OF NEW EMAILS:", numNewMail);
};

const config = {
  imap: {
    user: process.env.REL_SMTP_USER,
    password: process.env.REL_SMTP_PASS,
    host: process.env.REL_SMTP_HOST,
    port: process.env.REL_SMTP_PORT,
    tls: process.env.REL_SMTP_SECURE,
    authTimeout: 3000
  },

  onmail: processNewMail
};

const connect = async () => {
  try {
    const connection = await imaps.connect(config);
    return connection;    
  } catch(error) {
    // TODO: Deal with the error
    console.log("match-mail // connect / ERROR: ", error);
  }
};

const getNewMail = async connection => {
  const searchCriteria = [
    "UNSEEN"
  ];

  const fetchOptions = {
    bodies: ["HEADER", "TEXT"],
    markSeen: false
  };

  try {
    await connection.openBox("INBOX");

    const results = await connection.search(searchCriteria, fetchOptions);

    const newEmails = results.map(result => {

      const { parts: [{ body: { from: [from], subject: [subject], to: [to] }, }, {body: message}], } = result;
      // console.log(from, to, subject, message);
      // To
      // From
      // Subject
      // Body
      return {from, to, subject};
    });

  // console.log(newEmails);
  return newEmails;

  } catch(error) {
    console.log("matchMail.getNewMail // ERROR:\n" + error);
  }
}

const processMail = async () => {
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
  // On successful send, delete the original
}

module.exports = {
  connect,
  getNewMail
}
