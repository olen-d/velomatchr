import React from "react";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import SignupRequiredForm from "../components/signupRequiredForm";

const Signup = () => {
  return(
    <Container>
      <Grid stackable>
      <SignupRequiredForm 
          colWidth="6"
          formTitle="Sign Up"
        />
      </Grid>
    </Container>
  );
}

export default Signup;
