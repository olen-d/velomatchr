import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Form,
  Grid, 
  Header,
  Message,
  Segment
} from "semantic-ui-react"

import ErrorContainer from "./errorContainer";

const ResetPasswordForm = props => {
  const { colWidth, formTitle } = props;

  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isEmailError, setIsEmailError] = useState(false);
  // ...Rest of the State
  const [email, setEmail] = useState("");

  const postReset = () => {
    // TODO: Fill this in...
      // Form Validation
      let formError = false;

      if(email.length < 6) {
        setIsEmailError(true);
        formError = true;
      } else {
        setIsEmailError(false);
      }
  
      if(formError)
        {
          setIsErrorHeader("Unable to Reset Password");
          setIsErrorMessage("Please check the fields in red and try again.");
          setIsError(true);
          return;
        }
  }

  return(
    <Grid.Column width={colWidth}>
      <Header
        as="h2"
        textAlign="center"
        color="grey"
      >
        {formTitle}
      </Header>
      <ErrorContainer
        header={isErrorHeader}
        message={isErrorMessage}
        show={isError}
      />
      <Message>
        <p>
          Enter your email address below and we'll email you a link with instructions to reset your password.
        </p>
      </Message>
      <Segment>
        <Form
          size="large"
        >
          <Form.Input
            className="fluid"
            icon="envelope"
            iconPosition="left"
            name="email"
            value={email}
            placeholder="Email Address"
            type="email"
            error={isEmailError}
            onChange={e => {
              setEmail(e.target.value)
            }}
          />
          <Button
            disabled={!email}
            className="fluid"
            type="button"
            color="red"
            size="large"
            icon="check circle"
            labelPosition="left"
            content="Reset Password"
            onClick={postReset}
          >
          </Button>
        </Form>
      </Segment>
    </Grid.Column>
  );
}

ResetPasswordForm.defaultProps = {
  colWidth: 6,
  formTitle: "Reset Password"
}

ResetPasswordForm.propTypes = {
  colWidth: PropTypes.number,
  formTitle: PropTypes.string
}

export default ResetPasswordForm;