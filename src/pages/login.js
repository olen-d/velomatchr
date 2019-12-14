import React, { Component } from "react"

import {
  Container,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react"

import LoginForm from "../components/loginForm";

class Login extends Component {
  render() {
    return(
      <Container>
        <Grid stackable>
          <LoginForm 
            colWidth="6"
            formTitle="Sign In"
          />
        </Grid>
      </Container>
    );
  }
}

export default Login;
