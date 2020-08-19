const fetch = require("node-fetch");

const tokens = require("./tokens");

const send = async (email, firstName, lastName) => {
  const token = await tokens.create(-99); // Use -99 for userId for now. TODO: add special "server" user

  const formData = {
    fromAddress: "\"VeloMatchr Password Changed\" <changed@velomatchr.com>", 
    toAddress: email, 
    subject: "Your Password Has Been Changed", 
    message: `<p>Hi ${firstName} ${lastName},</p><p>Your VeloMatchr Password was recently changed. If you did not change your password, please conact us at <a href="mailto:support@velomatchr.com">support@velomatchr.com</a> to secure your account.</p>`
  }
  // Send the email
  fetch(`${process.env.REACT_APP_API_URL}/api/mail/send`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
      body: JSON.stringify(formData)
    }).then(data => {
      return data.json();
    }).then(json => {
      if (!json.error) {
        return { data: json };
      }
    }).catch(error => {
      return { error };
    });                
}

module.exports = {
  send
}
