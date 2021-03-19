import React from "react";

import {
  Route,
  Switch,
} from "react-router-dom";

import {
  Container,
  Grid,
  Header
 } from "semantic-ui-react";

import MatchesNewUser from "../components/matchesNewUser";
import MatchPreferencesForm from "../components/matchPreferencesForm";
import NotificationsRequiredForm from "../components/notificationsRequiredForm";
import ProfileRequiredForm from "../components/profileRequiredForm";
import SurveyForm from "../components/surveyForm";
import VerifyEmail from "../components/verifyEmail";

const Placeholder = () => {
  return(null);
}

const Onboarding = ({ match }) => {
  return(
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width="16">
            <Header
              as="h1"
              color="orange"
            >
              Welcome! Let's get started...
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Switch>
            <Route exact path={`${match.url}/`} component={Placeholder} />
            <Route
              path={`${match.url}/matches`}
              render={(props) => 
                <MatchesNewUser 
                  {...props}
                  colWidth={6}
                  submitBtnContent="Finished"
                  submitRedirect={true}
                  submitRedirectURL={"/onboarding/verify-email"}
                />
              }
            />
            <Route
              path={`${match.url}/match-preferences`}
              render={(props) => 
                <MatchPreferencesForm 
                  {...props}
                  colWidth={6}
                  formInstructions={"Tell us a bit about who you'd like to match with."}
                  formTitle={"Set Your Match Preferences"}
                  submitBtnContent="Save and Continue"
                  submitRedirect={true}
                  submitRedirectURL={"/onboarding/survey"}
                  isModal={false}
                />
              }
            />
            <Route
              path={`${match.url}/notification-preferences`}
              render={(props) =>
                <NotificationsRequiredForm
                  {...props}
                  colWidth={6}
                  emailNotificationsTitle={"Send Me an Email When:"}
                  firstHeadingAlig={"center"}
                  formInstructions={"Tell us how you would like to be notified when you have new buddy requests or someone accepts your request. Leave unchecked if you do not wish to be notified."}
                  formTitle={"Set Your Notification Preferences"}
                  submitBtnContent={"Save and Continue"}
                  submitRedirect={true}
                  submitRedirectURL={"/dashboard"}
                />
              }
            />
            <Route 
              path={`${match.url}/profile`} 
              render={(props) => 
                <ProfileRequiredForm
                  {...props} 
                  colWidth={6} 
                  formInstructions={"Set up your basic profile by telling us a few things about yourself. Only your first name and last initial will be displayed to other users. Your gender is never shown."}
                  formTitle={"Create Your Profile"} 
                  submitBtnContent="Save and Continue" 
                  submitRedirect={true} 
                  submitRedirectURL={"/onboarding/match-preferences"} 
                />
              }
            />
            <Route
              path={`${match.url}/survey`}
              render={(props) => 
                <SurveyForm 
                  {...props}
                  colWidth={8}
                  formInstructions={"Rate the following statements on a scale of one to five, with one indicating you strongly agree, three indicating neither agreement or disagreement, and five indicating strong disagreement."}
                  formTitle={"Your Cycling Preferences"}
                  submitBtnContent={"Find My Buddies"}
                  submitRedirect={true}
                  submitRedirectURL={"/onboarding/matches"}
                />
              }
            />
            <Route
              path={`${match.url}/verify-email`}
              render={(props) => 
                <VerifyEmail
                  {...props}
                  colWidth={6}
                  formInstructions={"We sent a six digit code to your email address. Please enter it below to verify you have access to the account. You will not be able to contact any buddies until your email is verified."}
                  formTitle={"Verify Your Email Address"}
                  show={true}
                  submitBtnContent={"Verify Email"}
                  submitRedirect={true}
                  submitRedirectURL={"/onboarding/notification-preferences"}
                />
              }
            />
          </Switch>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default Onboarding;
