const pwd = require("./pwd");

const validator = password => {
  pwd.validatePassword(password).then(result => {
    console.log(password+":", result);
  })
  .catch(error => {
    console.log(error);
  })
}

validator("abcdefgh");
validator("aB");
validator("aB1");
validator("ab1@");
validator("aZchese1");
validator("aZchese#");
validator("aZchse#");
validator("aZchese#1FF");
