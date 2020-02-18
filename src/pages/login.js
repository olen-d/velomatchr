import React from "react";

import { 
  Route,
  Switch
} from "react-router-dom";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import LoginForm from "../components/loginForm";
import ResetPasswordForm from "../components/resetPasswordForm";

const LoginPage = ({ match }) => {
  const Login = () => {
    return(
      <LoginForm 
        colWidth={6}
        formTitle="Sign In"
      />
    );
  }

  const ResetPassword = () => {
    return(
      <ResetPasswordForm
        colWidth={6}
        formTitle="Reset Password"
      />
    )
  }

  return(
    <Container>
      <Grid stackable>
        <Switch>
          <Route exact path={`${match.url}/`} component={Login} />
          <Route path={`${match.url}/reset-password`} component={ResetPassword} />
        </Switch>
      </Grid>
    </Container>
  );
}

export default LoginPage;
