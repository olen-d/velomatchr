// Functions
const validatePassword = password => {
    return new Promise((res, rej) => {
      try {
        const oneUpper = /[A-Z]/
        const oneLower = /[a-z]/
        const oneDigit = /\d/
        const oneSpecial = /[!@#$%^&*()-+=]/
        
        const isOneUpper = oneUpper.test(password);
        const isOneLower = oneLower.test(password);
        const isOneDigit = oneDigit.test(password);
        const isOneSpecial = oneSpecial.test(password);
        const isLength = password.length >= 8;

        if (isOneUpper && isOneLower && (isOneDigit || isOneSpecial) && isLength) {
          res(true);
        } else {
          res(false);
        }
      } catch {
        rej(false);
      }
    });
  };

  module.exports = { validatePassword }