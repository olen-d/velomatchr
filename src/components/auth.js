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

  logout() {
    const refreshToken = this.getRefreshToken().slice(1, -1); // Slice off the spuious ""
    const token = this.getToken().slice(1, -1);
    const userInfo = this.getUserInfo(token);

    localStorage.removeItem("user_token");
    localStorage.removeItem("user_refresh_token");

    if (userInfo && refreshToken) {
      const { user: id } = userInfo;
      const actionData = { id, refreshToken };

      fetch(`${process.env.REACT_APP_API_URL}/api/auth/token/refresh-token/`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(actionData)
      }).then(result => {
        console.log("Delete Result", result);
      }).catch(error => {
        console.log("Components/Auth.js Error:", error);
      }) ;
    }

    this.authenticated = false;
    return this.authenticated;
  }

  isAuthenticated() {
    if (this.tokenExists()) {
      const token = this.getToken();
      if(this.tokenActive(token)) {
        this.authenticated = true;
      }
    } 
    return this.authenticated;
  }

  getUserInfo(token) {
    if (this.tokenActive(token)) {
      return this.decodeToken(token);
    } else {
      return false;
    }
  }

  // Token related methods
  tokenExists() {
    return (this.getToken() != null) ? true : false;
  }

  tokenActive(token) {
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

  getToken() {
    return localStorage.getItem("user_token");
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
