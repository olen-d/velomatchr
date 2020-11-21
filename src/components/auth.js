import fetch from "node-fetch";
import jwt from "jsonwebtoken";

class Auth {
  constructor() {
    this.authenticated = false;
  }

  login(cb) {
    this.authenticated = true;
    cb();
  }

  logout(accessToken) {
    const refreshToken = this.getRefreshToken().slice(1, -1); // Slice off the spuious ""
    const userInfo = this.getUserInfo(accessToken);

    localStorage.removeItem("user_refresh_token");

    if (userInfo && refreshToken) {
      const { user: id } = userInfo;
      const actionData = { id, refreshToken };

      fetch(`${process.env.REACT_APP_API_URL}/api/auth/token/refresh-token/`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(actionData)
      }).then(result => {
        // console.log("Delete Result", result);
        return result.json;
      }).then(data => {
        console.log("Delete Result:", JSON.stringify(data));
      }).catch(error => {
        console.log("Components/Auth.js Error:", error);
      }) ;
    }

    this.authenticated = false;
    return this.authenticated;
  }

  checkAccessTokenExpiration(accessToken, userId) {
    return this.willExpire(accessToken) ? this.newAccessToken(userId) : { "isNewAccessToken": false, accessToken };
  }

  // Check to see if the access token is going to expire soon
  willExpire(token) {
    const { exp } = jwt.decode(token)
    const expirationBuffer = 1 * 10;
    return exp - expirationBuffer < Date.now() / 1000 ? true : false;
  }

  // If access token is expired, use the refresh token to retrieve a new access token
  newAccessToken(userId) {
    return new Promise((resolve, reject) => {
      const refreshToken = localStorage.getItem("user_refresh_token");

      if (refreshToken) {
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/token/grant-type/refresh-token`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userId, refreshToken })
          })
          .then(response => {
            return response.json();
          })
          .then(data => {
            const { access_token: accessToken, refresh_token: refreshToken } = data; // token_type: tokenType

            // Update the refresh in local storage
            localStorage.setItem("user_refresh_token", JSON.stringify(refreshToken));
    
            // Done, resolve the new access token
            resolve({ "isNewAccessToken": true, accessToken });
          })
          .catch(error => {
            // TODO: deal with the error
            console.log("useTokens.js // ERROR:", error);
            reject(error);
          });
      } else {
        // No refresh token was found
        resolve({ "isNewAccessToken": false, "hasRefreshToken": false });
      }
    });
  }

  getUserInfo(token) {
    return { ...this.decodeToken(token), isActive: this.isTokenActive(token) };
  }

  // Token related methods
  isTokenActive(token) {
    try {
      const decodedToken = this.decodeToken(token);
      if (decodedToken.exp > Date.now() / 1000) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("\n-----\nauth.js\n", "Active token check failed. ", err);
      return false;
    }
  }

  getRefreshToken() {
    return localStorage.getItem("user_refresh_token");
  }

  decodeToken(token) {
    // Security: this doesn't verify the token, since the secret is required
    // and could be discovered by viewing source. For anything critical, decode
    // the token on the server.
    const decodedToken = jwt.decode(token);
    return decodedToken;
  }
}

export default new Auth();
