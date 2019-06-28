import React, { Component } from "react";

import "./style.css";

import NavBar from "./components/navbar"
import Footer from "./components/footer"

class Template extends Component {

  render () {
    return (
      <>
        <NavBar cbfp={this.cb} />
        <Footer />
        </>
    );
  }
}

export default Template;
