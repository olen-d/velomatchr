// const Sequelize = require("sequelize");

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
}
