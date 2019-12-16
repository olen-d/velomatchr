import React, { Component } from "react"

import {
  Container,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react"

import SignupForm from "../components/signupForm";

class Signup extends Component {
  render() {
    return(
      <Container>
        <Grid stackable>
          <SignupForm 
            colWidth="6"
            formTitle="Sign Up"
          />
        </Grid>
      </Container>
    );
  }
}

export default Signup;
