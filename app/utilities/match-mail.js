const fetch = require("node-fetch");
const imaps = require("imap-simple");

// Helpers
const tokens = require ("../helpers/tokens");

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

      const { attributes: { uid }, parts: [{ body: { from: [from], subject: [subject], to: [to] }, }, {body: message}], } = result;
      // console.log(from, to, subject, message);
      // To
      // From
      // Subject
      // Body
      // uid - useful for deleting the email on the server
      return {from, to, subject, uid};
    });

  // console.log(newEmails);
  return newEmails;

  } catch(error) {
    console.log("matchMail.getNewMail // ERROR:\n" + error);
  }
}

const processMail = async (connection, emails) => {
  const token = await tokens.create(-99);
  const emailProxyStart = "buddy-";

  try {
    for (const email of emails) {
      const { from, to, subject, uid } = email;

      // Mark the email as seen to avoid duplicate processing, but don't delete it until it's successfully forwarded
      await connection.addFlags(uid, "\\Seen");

      // Get the addressee email address and userId from the proxy
      // The userId is needed later to get the sender's proxy
      let emailProxyStartIndex = to.indexOf(emailProxyStart);

      if (emailProxyStartIndex !== -1) {
        emailProxyStartIndex += emailProxyStart.length;
        const emailProxyEndIndex = to.indexOf("@velomatchr.com");

        const addresseeProxy = to.slice(emailProxyStartIndex, emailProxyEndIndex);
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/email-address/${addresseeProxy}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        const json = response.ok ? await response.json() : null;
        const { data: [{ requester: { id: addresseeId, email: addresseeEmail }, }], } = json;

        // Get the sender userId by email address
        const expression = /<.+@.+\..+>/i;
        const senderEmail = from.match(expression)[0].slice(1,-1);
        
        const responseSenderId = await fetch(`${process.env.REACT_APP_API_URL}/api/users/email/${senderEmail}`);
        const jsonSenderId = responseSenderId.ok ? await responseSenderId.json() : null;

        const { data : { id: senderId }, } = jsonSenderId;

        // Get the sender's email proxy

        console.log(senderId, addresseeId);
        const responseSenderProxy = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/email-proxy/id/${senderId}/${addresseeId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const jsonSenderProxy = responseSenderProxy.ok ? await responseSenderProxy.json() : null;
        const { data: [{ emailProxy: senderProxy }], } = jsonSenderProxy;
        console.log(senderProxy);
      }
    }

  // Build the reply buddy-sender-email-proxy@velomatchr.com
  // Subject - check for RE: and add if it doesn't exist
  // Body
  // Send the email
  // On successful send, delete the original using the uid
  } catch (error) {
    // TODO: deal with the error
    console.log("match-mail // processMail / ERROR:\n" + error);
  }
}

module.exports = {
  connect,
  getNewMail,
  processMail
}
