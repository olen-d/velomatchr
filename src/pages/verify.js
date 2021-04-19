import React from "react";

import { Route, Switch } from "react-router-dom";

import { Container, Grid } from "semantic-ui-react";

import ProfileBar from "../components/profileBar";
import VerifyEmail from "../components/verifyEmail";

const Placeholder = () => {
  return(null);
};

const Verify = ({ match }) => {
  return(
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <ProfileBar></ProfileBar>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Switch>
            <Route exact path={`${match.url}/`} component={Placeholder} />
            <Route
              path={`${match.url}/email`}
              render={(props) => 
                <VerifyEmail
                  {...props}
                  colWidth={6}
                  formInstructions={"We sent a six digit code to your email address. Please enter it below to verify you have access to the account. You will not be able to contact any buddies until your email is verified."}
                  formTitle={"Verify Your Email Address"}
                  sendVerificationMessage={true}
                  show={true}
                  submitBtnContent={"Verify Email"}
                  submitRedirect={true}
                  submitRedirectURL={"/dashboard"}
                />
              }
            />
          </Switch>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default Verify;
