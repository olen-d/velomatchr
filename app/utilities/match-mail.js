const fetch = require("node-fetch");
const imaps = require("imap-simple");
const mailBodyParser = require("mail-body-parser");

// Helpers
const tokens = require ("../helpers/tokens");

const processNewMail = async numNewMail => {
  if (numNewMail > 0) {
    const newEmails = await getNewMail();
    processMail(newEmails);
  }
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

const initialize = (async () => {
  try {
    const connection = await imaps.connect(config);
    return connection;
  } catch(error) {
    // TODO: Deal with the error
    console.log("match-mail // connect / ERROR: ", error);
  }
})();

const getNewMail = async () => {
  const searchCriteria = [
    "UNSEEN"
  ];

  const fetchOptions = {
    bodies: ["HEADER", "TEXT"],
    markSeen: false
  };

  const connection  = await initialize;
  try {
    await connection.openBox("INBOX");

    const results = await connection.search(searchCriteria, fetchOptions);
// console.log(results);
// console.log(results[0].parts[0].body["content-type"]);
    const newEmails = results.map(result => {

      const { attributes: { uid }, parts: [{ body: { "content-type": [contentType], from: [from], subject: [subject], to: [to] }, }, {body: message}], } = result;
      // console.log(from, to, subject, message);
      // console.log(contentType);
      // To
      // From
      // Subject
      // Content-Type
      // Body
      // uid - useful for deleting the email on the server
      return {contentType, from, message, to, subject, uid};
    });

  // console.log(newEmails);
    return newEmails;
  } catch(error) {
    // TODO: Deal with the error
    console.log("matchMail.getNewMail // ERROR:\n" + error);
  }
}

const processMail = async emails => {
  const connection = await initialize;
  const token = await tokens.create(-99);
  const emailProxyStart = "buddy-";

  try {
    for (const email of emails) {
      const { contentType, from, message, to, subject, uid } = email;

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

        const json = response.ok ? await response.json() : null
        const { data: [{ requester: { id: addresseeId, email: addresseeEmail }, }], } = json;

        // Get the sender userId by email address
        const expression = /<.+@.+\..+>/i;
        const fromParts = from.match(expression);
        const senderEmail = fromParts ? fromParts[0].slice(1,-1) : from;
        
        const responseSenderId = await fetch(`${process.env.REACT_APP_API_URL}/api/users/email/${senderEmail}`);
        const jsonSenderId = responseSenderId.ok ? await responseSenderId.json() : null;

        const { data : { id: senderId }, } = jsonSenderId;

        // Get the sender's email proxy
        const responseSenderProxy = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/email-proxy/id/${senderId}/${addresseeId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const jsonSenderProxy = responseSenderProxy.ok ? await responseSenderProxy.json() : null;
        const { data: [{ emailProxy: senderProxy }], } = jsonSenderProxy;

        // Parse the message using mail-body-parser
        // console.log(message);
        // Get the boundary from the headers, mail-body-parser will need this to split apart multipart messages
        const boundary = contentType.includes("multipart") ? "--" + contentType.slice(contentType.indexOf("boundary=") + 9) : null;
        
        const { bodyParts } = await mailBodyParser.parseBody(boundary, message);
        // console.log(bodyParts.text);
        const text = bodyParts.text ? bodyParts.text : false;
        const html = bodyParts.html ? bodyParts.html : false;

        // Data to pass to send endpoint
        const formData = {
          fromAddress: `"VeloMatchr Buddy" <buddy-${senderProxy}@velomatchr.com>`,
          toAddress: addresseeEmail,
          subject,
          text,
          html
        }

        // Send the email
        const responseSendMail = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/relationship/send`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const jsonSendMail = responseSendMail.ok? await responseSendMail.json() : null;
        // console.log("RESULT:", jsonSendMail);
        if (jsonSendMail.status !== 200) {
          // Send an error
          // TODO: IMPORTANT! Deal with the error - try and resend and/or send a bounce to the sender
          // console.log(jsonSendMail.message);
        } else { 
          // On successful send, delete the original using the uid
          const {data: { rejected }, } = jsonSendMail;
          if (rejected.length === 0) {
            await connection.deleteMessage([uid]);
            // TODO: Figure out if the message was deleted or not. Unfortunately, connection.deleteMessage doesn't seem to return anything.
          } else {
            // Mail was rejected by the receiving server
            // Log the error
            // Return a failure notice
          }
          // console.log("REJECTED:\n" + rejected, rejected.length +"\n");
          // console.log(jsonSendMail.success + "\n" + JSON.stringify(jsonSendMail) + "\nUID:", uid);
        }
      }
    } 
  } catch (error) {
    // TODO: deal with the error
    console.log("match-mail // processMail / ERROR:\n" + JSON.stringify(error));
  }
}

module.exports = {
  getNewMail,
  processMail
}
