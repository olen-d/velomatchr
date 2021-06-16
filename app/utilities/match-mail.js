const fetch = require("node-fetch");
const imaps = require("imap-simple");
const mailBodyParser = require("mail-body-parser");

// Helpers
const tokens = require("../helpers/tokens");

// Utilities
const logger = require("./logger");

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
  } catch (error) {
    logger.error(`server.utilities.match-mail.initialize ${error}`);
    throw new Error("Could not connect to IMAP server.");
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

    const newEmails = results.map(result => {
      // Check for content-transfer-encoding in the header
      let contentTransferEncoding = null;
      try {
        ({ contentTransferEncoding } = { parts: [{ body: { "content-transfer-encoding": [contentTransferEncoding] }, }], } = result);
      } catch {
        contentTransferEncoding = null
        logger.info("server.utilities.match-mail.get.new.mail Message did not have content transfer encoding specified.");
      }

      const { attributes: { uid }, parts: [{ body: { "content-type": [contentType], from: [from], subject: [subject], to: [to] }, }, {body: message}], } = result;

      return {
        contentTransferEncoding,
        contentType,
        from,
        message,
        to,
        subject,
        uid 
      };
    });
    return newEmails;
  } catch (error) {
      logger.error(`server.utilities.match-mail.get.new.mail ${error}`);
      throw new Error("Could not get new mail.");
  }
}

const processMail = async emails => {
  const connection = await initialize;
  const token = await tokens.create(-99);
  const emailProxyStart = "buddy-";

  try {
    for (const email of emails) {
      const { contentTransferEncoding, contentType, from, message, to, subject, uid } = email;

      // Mark the email as seen to avoid duplicate processing, but don't delete it until it's successfully forwarded
      await connection.addFlags(uid, "\\Seen");

      // Extract name@example.com and assign it to senderEmail
      const expression = /<.+@.+\..+>/i;
      const fromParts = from.match(expression);
      const senderEmail = fromParts ? fromParts[0].slice(1,-1) : from;

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
        // This returns null if match status is not 2 (matched) or 4 (blocked)

        if (!json) {
          // TODO: Update this to log the sender proxy as well. However, the sender proxy would need to be looked up.
          logger.info(`server.utilities.match-mail.process.mail Attempt to send email to ${addresseeProxy} failed due to addressee not found or unfriended.`);

          // Send a bounce email letting the sender know the email could not be sent
          const subject = "[VELOMATCHR] Undeliverable Email";
          const text = "Your buddy seems to have abandoned the race. This is likely because they have deleted their account or unfriended you.";
          const html = `<html><p>${text}</p></html>`;

          const formData = {
            fromAddress: `"VeloMatchr Undeliverable Email" <dropped@velomatchr.com>`,
            toAddress: senderEmail,
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

          if (jsonSendMail.status !== 200) {
            const { error, message } = jsonSendMail;

            logger.error(`server.utilities.match-mail.process.mail Attempt to send undeliverable email notification failed. ${message} ${error}`);
          } else { 
            logger.info("server.utilities.match-mail.process.mail Undeliverable email due to address not found or unfriended notification was sent.");
          }

          await connection.deleteMessage([uid]);
          continue; // Go on to the next email in the list
        }
        // Match was legitimate, carry on
        const { data: [{ requester: { id: addresseeId, email: addresseeEmail }, }], } = json;

        // Get the sender userId by email address
        const responseSenderId = await fetch(`${process.env.REACT_APP_API_URL}/api/users/email/${senderEmail}`);
        const jsonSenderId = responseSenderId.ok ? await responseSenderId.json() : null;

        const { data : { firstName, id: senderId, lastName }, } = jsonSenderId;

        const lastInitial = lastName.slice(0, 1) + ".";

        // Get relationship status, since only approved matches can email each other
        // Fail silently if the sender has been blocked by the recipient
        const responseRelationshipStatus = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/status/ids/?requesterid=${senderId}&addresseeid=${addresseeId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const responseRelationshipJson = responseRelationshipStatus.ok ? await responseRelationshipStatus.json() : null;

        if (responseRelationshipJson && responseRelationshipJson.status === 200) {
          const { data: { status }, } = responseRelationshipJson;
          if (status !== 2) {
            // /api/relationships/email-address/:addresseeProxy will only return relationships with a status of 2 or 4
            // Therefore, status is 4 (blocked), so terminate, but don't send a bounce email to the sender, so they won't know
            // they are blocked.
            await connection.deleteMessage([uid]);
            continue;
          } 
        } else {
          // Couldn't get status, log the error, remove the \Seen flag and try again
          // ! TODO Deal with the no status error
          // Log the error
          logger.error(`server.utilities.match-mail.process.mail Failed to get relationship status for sender ${senderId} and addressee ${addresseeId}`);
          await connection.delFlags(uid, "\\Seen");
          continue;
        }

        // Get the sender's email proxy
        const responseSenderProxy = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/email-proxy/id/${senderId}/${addresseeId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const jsonSenderProxy = responseSenderProxy.ok ? await responseSenderProxy.json() : null;
        const { data: [{ emailProxy: senderProxy }], } = jsonSenderProxy;

        // Parse the message using mail-body-parser
        // Determine if this is a multi-part message
        const isMultiPart = contentType.includes("multipart");
        let boundary = null;
        const headers = [];

        if (isMultiPart) {
          // Get the boundary from the headers, mail-body-parser will need this to split apart multipart messages
          // Check to see if the boundary value is enclosed in quotes
          let re = /boundary="[\n\r\S]*"/gmi;

          const isQuoted = re.test(contentType);
          const boundaryIndex = contentType.indexOf("boundary=");
          boundary = isQuoted ?  "--" + contentType.slice(boundaryIndex + 10, -1) : "--" + contentType.slice(boundaryIndex + 9)
        } else {
          // If the format is not multi-part, build a headers array to pass them to mail-body-parser, since headers won't be included in the body
          if (contentTransferEncoding) { headers.push(`content-transefer-encoding: ${contentTransferEncoding}`) }
          if (contentType) { headers.push(`content-type: ${contentType}`) }
        }

        const header = headers.length > 0 ? headers.join("\r\n") : null;
        const bodyParts = await mailBodyParser.parseBody(boundary, header, message);
        // ! TODO: Error trap this - currently just crashes if mailBodyParser returns an error

        const text = bodyParts.text ? bodyParts.text : false;
        const html = bodyParts.html ? bodyParts.html : false;
        // ! TODO: if text and html are both false, bail and send an error back
        // Data to pass to send endpoint
        const formData = {
          fromAddress: `"${firstName} ${lastInitial} (VeloMatchr Buddy)" <buddy-${senderProxy}@velomatchr.com>`,
          toAddress: addresseeEmail,
          subject,
          text,
          html
        }

        // Send the email ! TODO: Split this out into a function
        const responseSendMail = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/relationship/send`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const jsonSendMail = responseSendMail.ok? await responseSendMail.json() : null;

        if (jsonSendMail.status !== 200) {
          // Send an error
          const { error, message } = jsonSendMail;

          logger.error(`server.utilities.match-mail.process.mail Attempt to send email failed. ${message} ${error}`);
          // ! TODO: Deal with the error - try and resend and/or send a bounce to the sender
        } else { 
          // On successful send, delete the original using the uid
          const {data: { rejected }, } = jsonSendMail;
          if (rejected.length === 0) {
            await connection.deleteMessage([uid]);
            // TODO: Figure out if the message was deleted or not. Unfortunately, connection.deleteMessage doesn't seem to return anything.
          } else {
            // Mail was rejected by the receiving server
            // Log the error
            logger.error(`server.utilities.match-mail.process.mail Attempt to send email failed. ${rejected}`);
            // Return a failure notice
          }
        }
      }
    } 
  } catch (error) {
    logger.error(`server.utilities.match-mail.process.mail ${error}`);
    throw new Error("Could not process all mail messages.");
  }
}

module.exports = {
  getNewMail,
  processMail
}
