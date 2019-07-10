import React, { Component } from "react"

import MatchesForm from "../components/matchesForm"

import {
  Container,
  Form,
  Grid,
  Header,
  Icon
} from "semantic-ui-react"

class MatchPreferences extends Component {
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
                About Your Matches
              </Header>
            </Grid.Column>
          </Grid.Row>
            <MatchesForm 
              colWidth="8"
              formTitle="Your Match Characteristics"
              formInstructions="Please tell us your preferences regarding who you'd like to match with."
              submitContent="Take the Survey"
            />
        </Grid>
      </Container>
    );
  }
}
    
export default MatchPreferences;
