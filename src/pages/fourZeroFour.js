import React from "react";

import {
  Container,
  Grid,
  Header
} from "semantic-ui-react";

const FourZeroFour = () => {

  return(
    <Container>
      <Grid stackable>
        <Grid.Column width={16}>
          <Header
            as="h1"
            color="orange"
          >
            Page Has Bonked
          </Header>
          <Header
            as="h3"
            color="grey"
          >
            The page you are looking for has been dropped and cannot be found.
          </Header>
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default FourZeroFour;
