import React, { Component } from "react"

import { 
  Link,
  Route,
  Switch
} from "react-router-dom";
// import SurveyForm from "../components/surveyForm"

import {
  Container,
  Form,
  Grid,
  Header,
  Icon
} from "semantic-ui-react"

import MatchPreferences from "./../components/matchPreferences";


class Matches extends Component {
  state = {
  }
 
  render () {
    return(
      <Container>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={16}>
              <Header 
                as="h1"
                color="orange"
              >
                Matches
              </Header>
              <Link to="/matches/preferences">LINKY</Link>
            </Grid.Column>
          </Grid.Row>
            <Switch>
              <Route path="/matches/preferences" component={MatchPreferences} />
            </Switch>
            {/* <SurveyForm 
              colWidth="8"
              formTitle="Your Cycling Preferences"
              formInstructions="Rate the following statements on a scale of one to five, with one indicating you strongly agree, three indicating neither agreement or disagreement, and five indicating strong disagreement."
              submitContent="Find My Buddy"
            /> */}
        </Grid>
      </Container>
    );
  }
}
    
export default Matches;
