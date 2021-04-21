import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { Button, Grid, Header } from "semantic-ui-react";

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
          <Header
            as="h3"
            color="grey"
          >
            Still Haven't Found What You're Looking For?
          </Header>
          <p>
            Please use the contact form below to let us know which page you were looking for and we will do our best to locate it and send you an updated link. To help us find the information you are looking for, please describe the content or the URL of the page you were trying to view.
          </p>
        </Grid.Column>
      </Grid.Row>
      <ContactForm
        colWidth={12}
        mailbox={process.env.REACT_APP_FOURZEROFOUR_MAILBOX}
        messageBody="The content, name of the page, or URL you were looking for."
        messageHeader="What were you looking for?"
      />
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
