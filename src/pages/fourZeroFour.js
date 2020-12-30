import React from "react";

import {
  Container,
  Grid,
  Icon,
  Header
} from "semantic-ui-react";

const FourZeroFour = props => {

  return(
    <Container>
      <Grid stackable>
        <Grid.Column width={16}>
          <Header
            as="h1"
            color="orange"
          >
            <Icon name="exclamation triangle" /> Page Has Been Dropped
          </Header>
          <Header
            as="h3"
            color="grey"
          >
            The page you are looking for is off the back and did not make the time cut.
          </Header>
          <p>
            Grab a sticky bottle from the team car and we'll help you get back on terms with the peloton.
          </p>
        </Grid.Column>
        {props.children /* Render the authorized or unauthorized component passed from the route */}
      </Grid>
    </Container>
  )
}

export default FourZeroFour;
