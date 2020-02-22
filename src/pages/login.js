import React, { useEffect, useState } from "react";

import { useParams } from "react-router";
import { 
  Route,
  Switch,
} from "react-router-dom";

import {
  Container,
  Grid,
  Message
 } from "semantic-ui-react";

import LoginForm from "../components/loginForm";
import RequestPasswordResetForm from "../components/requestPasswordResetForm";
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
    const { id, token } = useParams();

    const [jwt, setJwt] = useState(null);

    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/password/reset/${id}/${token}`).then(data => {
        data.json().then(json => {
         setJwt(json);
        })
      });
    }, [id, token]);

    if(jwt && jwt.error) {
      return(
        <Grid.Column width="6">
          <Message negative>
            <Message.Header>
              Unable to Validate Password Reset Link
            </Message.Header>
            <Message.Content>
              Either the link is expired or invalid. Please try again.
            </Message.Content>
          </Message>
        </Grid.Column>
      )
    } else {
      return(
        <ResetPasswordForm
          colWidth={6}
          formTitle="Reset Password"
          token={token}
          userId={id}
        />
      )
    }
  }

  const RequestPasswordReset = () => {
    return(
      <RequestPasswordResetForm
        colWidth={6}
        formTitle="Request Password Reset"
      />
    )
  }

  return(
    <Container>
      <Grid stackable>
        <Switch>
          <Route exact path={`${match.url}/`} component={Login} />
          <Route path={`${match.url}/request-password-reset`} component={RequestPasswordReset} />
          <Route path={`${match.url}/reset-password/:id/:token`} component={ResetPassword} />
        </Switch>
      </Grid>
    </Container>
  );
}

export default LoginPage;
