import React, { Component } from "react";

import "./style.css";

import NavBar from "./components/navbar"
import Footer from "./components/footer"

class Template extends Component {
  state = {
    // isAuthenticated: null
  };

  render () {
    return (
      <>
        <NavBar />
        <Footer />
        </>
    );
  }
}

export default Template;
