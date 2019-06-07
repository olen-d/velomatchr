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
          <Grid.Row>
            <Grid.Column width={16}>
              <Form>

              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>


      <form id="survey">
          <div className="row">
              <div className="col s12">
                  <h5 className="orange-text text-darken-2">
                      Your Cycling Preferences
                  </h5>
              </div>
          </div>
          <div className="row">
              <div className="col s12 m6">
                  <p>
                      Rate the following statements on a scale of one to five, with one indicating you strongly disagree, three indicating neither agreement or disagreement, and five indicating strong agreement.
                  </p>
              </div>
          </div>
          <div className="row">
            <SurveyForm />
          </div>
          <div className="row center">
              <button type="submit" 
                  value="submit" 
                  id="survey-btn" 
                  className="btn-large waves-effect waves-light red accent-4"
                  >   
                  <i className="fas fa-check-circle"></i> Find My Buddy
              </button>
          </div>
      </form>
      </Container>
    );
  }
}
    
export default Survey;
