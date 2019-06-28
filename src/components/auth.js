class Auth {
  constructor() {
    this.authenticated = false;
  }

  login(cb) {
    this.authenticated = true;
    cb();
  }

  logout(cb) {
    localStorage.removeItem("user_token");
    this.authenticated = false;
    cb();
  }

  isAuthenticated() {
    if (localStorage.getItem("user_token") != null) {
      this.authenticated = true;
    } 
    return this.authenticated;
  }
}

export default new Auth();
