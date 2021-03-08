// const Sequelize = require("sequelize");
const fetch = require("node-fetch");
const tokens = require("../helpers/tokens");

//Models
const { NotificationPref } = require("../models");

// Create Notification Preferences
exports.create_notification_preferences = async (req, res) => {
  const { authorized } = req;

  if (authorized) {
    try {
      const { body: { userId }, } = req;
      const email = 0;
      const sms = 0;

      const codes = ["newRequest", "newMatch", "newBuddy"];

      const createResult = await NotificationPref.bulkCreate([
        { userId, code: codes[0], email, sms },
        { userId, code: codes[1], email, sms },
        { userId, code: codes[2], email, sms}
      ]);

      if (createResult) {
        res.status(201).json({ status: 201, message: "Created"});
      } else {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
      }
    } catch(error) {
      // TODO: deal with the error
      res.status(500).json({ status: 500, message: "Internal Server Error", error });
    }
  } else {
    res.sendStatus(403);
  }
}

// Update Notification Preferences
exports.update_notification_preferences = async (req, res) => {
  const { authorized } = req;

  if (authorized) {
    const { body: { userId, code, email, sms }, } = req;

    const fields = {};

    if (typeof email !=="undefined") { fields.email = email }
    if (typeof sms !=="undefined") { fields.sms = sms }

    try {
      const updateResult = await NotificationPref.update(
        fields,
        { where: { userId, code }
      });

      if (updateResult[0] === 0 ) {
        console.log("Update Result 0", )
        res.status(500).json({ status: 500, message: "Internal Server Error" });
      } else {
        res.status(200).json({ status: 200, message: "ok" });
      }
    } catch(error) {
      console.log(error);
      res.status(500).json({ status: 500, message: "Internal Server Error", error });
    }
  } else {
    res.sendStatus(403);
  }
};

// New Match Accepted Notification
exports.send_new_match_accepted = async (req, res) => {
  const { authorized } = req;

  if (authorized) {
    try {
      const token = await tokens.create(-99); // userId of -99 for now, TODO: set up a special "server" user for tokens

      const { query: { addresseeid: addresseeId, requesterid: requesterId }, } = req;
      if (addresseeId === undefined) { throw new Error("The parameter 'addresseeid' is required") }
      if (requesterId === undefined) { throw new Error("The parameter 'requesterid' is required") }

      const matchAttributes = await getMatchAttributes(addresseeId, "newBuddy", requesterId)
      const { 
        addresseeEmail,
        addresseeFirstName,
        addresseeLastName,
        email,
        requesterFirstName,
        requesterLastName
      } = matchAttributes;
      
      const requesterLastInitial = requesterLastName ? requesterLastName.slice(0,1) : "N";

      const newMatchLink = ""; // ! TODO: Set up a link to directly respond to the new match.

      if (email) {
        // Create the email
        const formData = {
          fromAddress: "\"VeloMatchr New Buddy Accepted\" <new-buddy-accepted@velomatchr.com>", 
          toAddress: addresseeEmail, 
          subject: `Buddy Request Accepted by ${requesterFirstName} ${requesterLastInitial}.`, 
          message: `<p>Hi ${addresseeFirstName} ${addresseeLastName},</p><p>${requesterFirstName} ${requesterLastInitial}. has accepted your buddy request. <a href=${newMatchLink}>Contact your new buddy now</a>! </p>`
        }
        // Send the email
        const sendNewMatchAcceptedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/send`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
            body: JSON.stringify(formData)
          });
    
        const sendNewMatchAcceptedJson = sendNewMatchAcceptedResponse.ok ? await sendNewMatchAcceptedResponse.json() : null;
    
        if (sendNewMatchAcceptedJson && !sendNewMatchAcceptedJson.error) {
          res.status(200).json({ status: 200, message: "ok", data: sendNewMatchAcceptedJson });
        } else {
          res.status(500).json({ status: 500, message: "Internal Server Error", error: "Could not send email." });
        }
      } else {
        res.sendStatus(200); // TODO: Eliminate this block when SMS is implemented and check for email || sms at the beginning and bail if both false
      }
    } catch(error) {
      const { message: errorMessage } = error
      res.json({ status: 500, message: "Internal  Server Error", error: errorMessage });
    }

  } else {
    res.sendStatus(403);
  }
};

// New Match Request Notification

exports.send_new_match_request = async (req, res) => {
  const { authorized } = req;

  if (authorized) {
    try {
      const token = await tokens.create(-99); // userId of -99 for now, TODO: set up a special "server" user for tokens

      const { query: { addresseeid: addresseeId, requesterid: requesterId }, } = req;
      if (addresseeId === undefined) { throw new Error("The parameter 'addresseeid' is required") }
      if (requesterId === undefined) { throw new Error("The parameter 'requesterid' is required") }

      const matchAttributes = await getMatchAttributes(addresseeId, "newRequest", requesterId)
      const { 
        addresseeEmail,
        addresseeFirstName,
        addresseeLastName,
        email,
        requesterFirstName,
        requesterLastName
      } = matchAttributes;
      
      const requesterLastInitial = requesterLastName ? requesterLastName.slice(0,1) : "N";

      const matchRequestLink = ""; // ! TODO: Set up a link to directly respond to the match request.

      if (email) {
        // Create the email
        const formData = {
          fromAddress: "\"VeloMatchr New Buddy Request\" <new-buddy-request@velomatchr.com>", 
          toAddress: addresseeEmail, 
          subject: `New Buddy Request From: ${requesterFirstName} ${requesterLastInitial}.`, 
          message: `<p>Hi ${addresseeFirstName} ${addresseeLastName},</p><p>${requesterFirstName} ${requesterLastInitial}. has sent you a new buddy request. <a href=${matchRequestLink}>Respond to the Request</a>. </p>`
        }
        // Send the email
        const sendNewMatchRequestResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/send`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
            body: JSON.stringify(formData)
          });
    
        const sendNewMatchRequestJson = sendNewMatchRequestResponse.ok ? await sendNewMatchRequestResponse.json() : null;
    
        if (sendNewMatchRequestJson && !sendNewMatchRequestJson.error) {
          res.status(200).json({ status: 200, message: "ok", data: sendNewMatchRequestJson });
        } else {
          res.status(500).json({ status: 500, message: "Internal Server Error", error: "Could not send email." });
        }
      } else {
        res.sendStatus(200); // TODO: Eliminate this block when SMS is implemented and check for email || sms at the beginning and bail if both false
      }
    } catch(error) {
      const { message: errorMessage } = error
      res.json({ status: 500, message: "Internal  Server Error", error: errorMessage });
    }

  } else {
    res.sendStatus(403);
  }
}

// Helpers

const getMatchAttributes = async (addresseeId, notificationType, requesterId) => {
  try {
    const token = await tokens.create(-99); // userId of -99 for now, TODO: set up a special "server" user for tokens

      // Check to see if the addressee wants a notification

      const addresseeNotificationPrefsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/notifications/preferences/${addresseeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const addresseeNotificationPrefsJson = addresseeNotificationPrefsResponse.ok ? await addresseeNotificationPrefsResponse.json() : null;

      if (!addresseeNotificationPrefsJson) { throw new Error("Could not get notification preferences.") }

      const { data: { userNotificationPrefs }, } = addresseeNotificationPrefsJson;

      const indexNewRequest = userNotificationPrefs.findIndex(item => item.code === notificationType);

      const { email } = userNotificationPrefs[indexNewRequest]; // TODO: add sms to destructuring

      const addresseeUserResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${addresseeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const addresseeUserJson = addresseeUserResponse.ok ? await addresseeUserResponse.json() : null;
      if (!addresseeUserJson) { throw new Error("Could not get user information for addressee.") }

      const requesterUserResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${requesterId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const requesterUserJson = requesterUserResponse.ok ? await requesterUserResponse.json() : null;
      if (!requesterUserJson) { throw new Error("Could not get user information for requester.") }

      const { user: { email: addresseeEmail, firstName: addresseeFirstName, lastName: addresseeLastName }, } = addresseeUserJson; // TODO: add phone: addresseePhone to destructuring
      const { user: { firstName: requesterFirstName, lastName: requesterLastName }, } = requesterUserJson;
      
      return ({ 
        addresseeEmail,
        addresseeFirstName,
        addresseeLastName,
        email,
        requesterFirstName,
        requesterLastName
      });
  } catch (error) {

  }
}
