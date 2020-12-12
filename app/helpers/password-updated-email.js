const fetch = require("node-fetch");

const tokens = require("./tokens");

/**
 * Send an email to the user stating their password was changed
 * @author Olen Daelhousen <matchr@olen.dev>
 * @param {string} email - the email address of the user
 * @param {string} firstName - the first name of the user
 * @param {string} lastName - the last name of the user
 * @returns {Promise} Promise object represents success or an error code if the email was not sent
 */

const updated = (email, firstName, lastName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await tokens.create(-99); // Use -99 for userId for now. TODO: add special "server" user

      const formData = {
        fromAddress: "\"VeloMatchr Password Changed\" <changed@velomatchr.com>", 
        toAddress: email, 
        subject: "Your Password Has Been Changed", 
        message: `<p>Hi ${firstName} ${lastName},</p><p>Your VeloMatchr Password was recently changed. If you did not change your password, please conact us at <a href="mailto:support@velomatchr.com">support@velomatchr.com</a> to secure your account.</p>`
      }
    
      // Send the email
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/send`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const json = response.ok ? await response.json() : false;
      if (!json) {
        resolve({
          status: 500,
          message: "Internal Server Error",
          error: "Something went horribly awry." 
        });
      } else {
        resolve(json);
      }
    } catch(error) {
      reject({
        status: 500,
        message: "Internal Server Error",
        error
      });
    }
  });
}

module.exports = {
  updated
}
