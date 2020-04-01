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
import SuccessContainer from "./successContainer";

const ResetPasswordForm = props => {
  const { colWidth, formTitle } = props;

  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isEmailError, setIsEmailError] = useState(false);
  // Set up the State for successful reset link
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);
  // ...Rest of the State
  const [email, setEmail] = useState("");

  const postRequest = () => {
    const formData = { email }

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
      } else {
        fetch(`${process.env.REACT_APP_API_URL}/api/users/password/reset`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }).then(response => {
          return response.json();
        }).then(data => {
          if(data.data) {
            setIsSuccessHeader("Please Check Your Email");
            setIsSuccessMessage("A message with instructions to reset your password was successfully sent to the email address you entered.");
            setIsError(false);
            setIsSuccess(true);
          } else {
            setIsErrorHeader("Invalid Email Address");
            setIsErrorMessage("Please check the email address you entered and try again.");
            setIsEmailError(true);
            setIsError(true);
          }
        }).catch(error => {
            setIsErrorHeader("Something Went Terribly Awry");
            setIsErrorMessage("Please check your email address and try again.");
            setIsError(true);
        });
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
      <SuccessContainer
        header={isSuccessHeader}
        message={isSuccessMessage}
        show={isSuccess}
      />
      <Message>
        <Message.Content>
          Enter your email address below and we'll email you a link with instructions to reset your password.
        </Message.Content>
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
            content="Request Password Reset"
            onClick={postRequest}
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
