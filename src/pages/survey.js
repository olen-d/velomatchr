import React from "react";

import {
  Container,
  Grid,
  Header
} from "semantic-ui-react";

import ProfileBar from "../components/profileBar";
import SurveyForm from "../components/surveyForm";

const Survey = () => {
  return(
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <ProfileBar></ProfileBar>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header 
              as="h1"
              color="orange"
            >
              Survey
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <SurveyForm 
            colWidth={8}
            formInstructions="Rate the following statements on a scale of one to five, with one indicating you strongly agree, three indicating neither agreement or disagreement, and five indicating strong disagreement."
            formTitle="Your Cycling Preferences"
            submitBtnContent="Find My Buddies"
            submitRedirect={true}
            submitRediredtURL={"/dashboard"}
          />
        </Grid.Row>
      </Grid>
    </Container>
  );
}
    
export default Survey;
