import React, { Component } from "react";

import "./style.css";

import LoginBar from "./components/loginBar"
import Footer from "./components/footer"

class UnAuthApp extends Component {

  render () {
    return (
      <>
        <LoginBar />
        <Footer />
      </>
    );
  }
}

export default UnAuthApp;
