import React from "react"

import {
  Container,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react"

import LoginForm from "../components/loginForm";

const Login = () => {
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

export default Login;
