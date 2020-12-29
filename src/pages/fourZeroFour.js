import React from "react";

import {
  Container,
  Grid,
  Icon,
  Header
} from "semantic-ui-react";

import FourZeroFourAuth from "../components/fourZeroFourAuth";
import FourZeroFourUnAuth from "../components/fourZeroFourUnAuth";

import { useAuth } from "../context/authContext";

const FourZeroFour = () => {

  const { isAuth } = useAuth();

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
        {isAuth ? <FourZeroFourAuth colWidth={12} /> : <FourZeroFourUnAuth colWidth={16} />}
      </Grid>
    </Container>
  )
}

export default FourZeroFour;
