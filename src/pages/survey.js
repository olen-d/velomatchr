import React, { Component } from "react"

import SurveyForm from "../components/surveyForm"

import {
  Container,
  Form,
  Grid,
  Header,
  Icon
} from "semantic-ui-react"

class Survey extends Component {
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
              colWidth="8"
              formTitle="Your Cycling Preferences"
              formInstructions="Rate the following statements on a scale of one to five, with one indicating you strongly disagree, three indicating neither agreement or disagreement, and five indicating strong agreement."
              submitContent="Find My Buddy"
            />
        </Grid>
      </Container>
    );
  }
}
    
export default Survey;
