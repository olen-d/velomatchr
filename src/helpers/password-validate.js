/**
 * Validate that a potential password meets minimum requirements
 * @author Olen Daelhousen <matchr@olen.dev>
 * @param {string} password - the password to be tested
 * @returns {Promise} Promise object represents true if the password passes validation or false if not
 */

const validatePassword = password => {
    return new Promise((resolve, reject) => {
      try {
        const oneUpper = /[A-Z]/
        const oneLower = /[a-z]/
        const oneDigit = /\d/
        const oneSpecial = /[!@#$%^&*()-+=]/
        
        const isOneUpper = oneUpper.test(password);
        const isOneLower = oneLower.test(password);
        const isOneDigit = oneDigit.test(password);
        const isOneSpecial = oneSpecial.test(password);
        const isLength = password && password.length >= 8; // Short circuit to avoid promise rejection if null or undefined password is passed

        if (isOneUpper && isOneLower && (isOneDigit || isOneSpecial) && isLength) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch {
        reject(false);
      }
    });
  };

  module.exports = { validatePassword }
  