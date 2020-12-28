import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { Button, Grid } from "semantic-ui-react";

import ContactForm from "./contactForm";

const FourZeroFourAuth = props => {
  const { colWidth } = props;

  return(
    <>
      <Grid.Row columns={4}>
        <Grid.Column>
        <Button
            as={Link}
            to="/dashboard"
            compact
            fluid
            color="orange"
          >
            View Dashboard
          </Button>
        </Grid.Column>
        <Grid.Column>
          <Button
            as={Link}
            to="/matches"
            compact
            fluid
            color="orange"
          >
            See Your Matches
          </Button>
        </Grid.Column>
        <Grid.Column>
          <Button
            as={Link}
            to="/survey"
            compact
            fluid
            color="orange"
          > 
            Take the Survey
          </Button>
        </Grid.Column>
        <Grid.Column>
          <Button
            as={Link}
            to="/settings/profile"
            compact
            fluid
            color="orange"
          >
            Update Your Profile
          </Button>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={colWidth}>
          Placeholder Message
        </Grid.Column>
      </Grid.Row>
      <ContactForm mailbox={process.env.REACT_APP_FOURZEROFOUR_MAILBOX} />
    </> 
  );
}

FourZeroFourAuth.defaultProps = {
  colWidth: 16
}

const { number } = PropTypes;

FourZeroFourAuth.propTypes = {
  colWidth: number
}

export default FourZeroFourAuth;
