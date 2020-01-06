import React from "react";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import SignupForm from "../components/signupForm";

const Signup = () => {
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

export default Signup;
