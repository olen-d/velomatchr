import React from "react";

import {
  Route,
  Switch
} from "react-router-dom";

import {
  Container,
  Grid
 } from "semantic-ui-react";

import MatchesNewUser from "../components/matchesNewUser";
import MatchPreferencesForm from "../components/matchPreferencesForm";
import ProfileRequiredForm from "../components/profileRequiredForm";
import SurveyForm from "../components/surveyForm";

const Placeholder = () => {
  return(null);
}

const Onboarding = ({ match }) => {
  return(
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Switch>
            <Route exact path={`${match.url}/`} component={Placeholder} />
            <Route
              path={`${match.url}/matches`}
              render={(props) => <MatchesNewUser {...props} submitBtnContent="Finished" submitRedirect={true} submitRedirectURL={"/dashboard"} />}
            />
            <Route
              path={`${match.url}/match-preferences`}
              render={(props) => <MatchPreferencesForm {...props} colWidth={"6"} formTitle={"Match Preferences"} submitBtnContent="Save and Continue" submitRedirect={true} submitRedirectURL={"/onboarding/survey"} />}
            />
            <Route 
              path={`${match.url}/profile`} 
              render={(props) => <ProfileRequiredForm {...props} colWidth={"6"} formTitle={"Create Profile"} submitBtnContent="Save and Continue" submitRedirect={true} submitRedirectURL={"/onboarding/match-preferences"} />}
            />
            <Route
              path={`${match.url}/survey`}
              render={(props) => 
                <SurveyForm 
                  {...props} 
                  colWidth={"8"} 
                  formTitle={"Your Cycling Preferences"} 
                  formInstructions={"Rate the following statements on a scale of one to five, with one indicating you strongly agree, three indicating neither agreement or disagreement, and five indicating strong disagreement."} 
                  submitBtnContent={"Find My Buddies"}
                  submitRedirect={true}
                  submitRedirectURL={"/onboarding/matches"}
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
