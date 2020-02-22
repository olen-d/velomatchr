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
  const [isPasswordError, setIsPasswordError] = useState(false);
  // Set up the State for successful reset link
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);
  // ...Rest of the State
  const [password, setPassword] = useState("");

  const postReset = () => {
    const formData = { password }

    // Form Validation
    let formError = false;

    if(password.length < 6) {
      setIsPasswordError(true);
      formError = true;
    } else {
      setIsPasswordError(false);
    }

    if(formError)
      {
        setIsErrorHeader("Unable to Create New Password");
        setIsErrorMessage("Please check the fields in red and try again.");
        setIsError(true);
        return;
      } else {
        fetch(`${process.env.REACT_APP_API_URL}/api/users/password/update`, {
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
            setIsSuccessMessage("An email with a link to reset your password was successfully sent to your account.");
            setIsSuccess(true);
          } else {
            setIsErrorHeader("Unable to Reset Password");
            setIsErrorMessage("No accounts associated with that email address were found. Please check your email address and try again.");
            setIsError(true);
          }
        }).catch(error => {
            setIsErrorHeader("Unable to Reset Password");
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
          Enter your new password below. Passwords must be at least eight characters long and contain buth upper and lowercase letters and one or more numbers.
        </Message.Content>
      </Message>
      <Segment>
        <Form
          size="large"
        >
          <Form.Input
            className="fluid"
            icon="lock"
            iconPosition="left"
            name="password"
            value={password}
            placeholder="New Password"
            type="password"
            error={isPasswordError}
            onChange={e => {
              setPassword(e.target.value)
            }}
          />
          <Button
            disabled={!password}
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
