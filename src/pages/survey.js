import React from "react";

import SurveyForm from "../components/surveyForm";

import {
  Container,
  Grid,
  Header
} from "semantic-ui-react";

const Survey = () => {
  return(
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header 
              as="h1"
              color="orange"
            >
              Survey Questions
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header 
                as="h2"
                color="orange"
            >
                About Yourself
            </Header>
          </Grid.Column>
        </Grid.Row>
          <SurveyForm 
            colWidth={8}
            formInstructions="Rate the following statements on a scale of one to five, with one indicating you strongly agree, three indicating neither agreement or disagreement, and five indicating strong disagreement."
            formTitle="Your Cycling Preferences"
            submitBtnContent="Find My Buddies"
            submitRedirect={true}
            submitRediredtURL={"/dashboard"}
          />
      </Grid>
    </Container>
  );
}
    
export default Survey;
