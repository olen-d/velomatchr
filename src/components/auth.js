import fetch from "node-fetch";
import jwt from "jsonwebtoken";

const logout = async accessToken => {
  const refreshToken = getRefreshToken() ? getRefreshToken().slice(1, -1) : false; // Slice off the spuious ""
  const userInfo = getUserInfo(accessToken);

  if (userInfo && refreshToken) {
    const { user: id } = userInfo;
    const actionData = { id, refreshToken };

    try {
      const { isNewAccessToken, accessToken: newAccessTokenValue } = await checkAccessTokenExpiration(accessToken, id);
      const token = isNewAccessToken ? newAccessTokenValue : accessToken;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/token/refresh-token/`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(actionData)
      });
      
      localStorage.removeItem("user_refresh_token");

      if (response.status !== 204) {
        // const json = await response.json();
        // TODO: Clean up the DB
        // TODO: Log the error
      } 
      return false;
    } catch(error) {
      // TODO: Log the error
      return false;
    }
  } else {
    // Either the access or refresh token was missing. Clean up local storage and return false.
    localStorage.removeItem("user_refresh_token");
    return false;
  }
}

const checkAccessTokenExpiration = (accessToken, userId) => {
  return willExpire(accessToken) ? newAccessToken(userId) : { "isNewAccessToken": false, accessToken };
}

// Check to see if the access token is going to expire soon
const willExpire = token => {
  const { exp } = jwt.decode(token)
  const expirationBuffer = 5 * 60;  // Within 5 minutes of expiration
  return exp - expirationBuffer < Date.now() / 1000 ? true : false;
}

// If access token is expired, use the refresh token to retrieve a new access token
const newAccessToken = userId => {
  return new Promise((resolve, reject) => {
    const refreshToken = JSON.parse(localStorage.getItem("user_refresh_token"));

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
          if (refreshToken) { localStorage.setItem("user_refresh_token", JSON.stringify(refreshToken)) }
  
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

const getUserInfo = token => {
  return { ...decodeToken(token), isActive: isTokenActive(token) };
}

const isTokenActive = token => {
  try {
    const decodedToken = decodeToken(token);
    if (decodedToken && decodedToken.exp > Date.now() / 1000) { // Short circuit to avoid TypeError if exp is undefined or null
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("\n-----\nauth.js\n", "Active token check failed. ", err);
    return false;
  }
}

const getRefreshToken = () => {
  return localStorage.getItem("user_refresh_token");
}

const decodeToken = token => {
  // Security: this doesn't verify the token, since the secret is required
  // and could be discovered by viewing source. For anything critical, decode
  // the token on the server.
  const decodedToken = jwt.decode(token);
  return decodedToken;
}


export {
  checkAccessTokenExpiration,
  decodeToken,
  getRefreshToken,
  getUserInfo,
  logout,
  newAccessToken
}
