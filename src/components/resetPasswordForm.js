import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Form,
  Grid, 
  Header,
  Message,
  Popup,
  Segment
} from "semantic-ui-react"

import ErrorContainer from "./errorContainer";
import SuccessContainer from "./successContainer";
import PasswordRequirements from "./passwordRequirements";

import passwordValidate from "../helpers/password-validate";

const ResetPasswordForm = props => {
  const { colWidth, formTitle, token, userId } = props;

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

  const updatePassword = formData => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users/password/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data.errors) {
        // There was a validation issue
        const { errors } = data;
        errors.forEach(e => {
          if (e["error"] === "IVP") {
            setIsPasswordError(true);
            setIsErrorMessage("The password you entered did not meet the requirements. Please try again. ");
            setIsError(true);
            formError = true;
          } else {
            setIsError(false);
          }
        });
      } else {
        if(data.data && data.data[0] === 1) {
          setIsSuccessHeader("Your Password was Successfully Reset");
          setIsSuccessMessage(`You can now login using your new password.`);
          setIsSuccess(true);
          setIsError(false);
          setPassword("");
        } else {
          setIsErrorHeader("Unable to Reset Password");
          setIsErrorMessage("Something went terribly awry. Please try again." + JSON.stringify(data.error));
          setIsError(true);
        }
      }
    }).catch(error => {
        setIsErrorHeader("Unable to Reset Password");
        setIsErrorMessage("Something went wrong. Please try again.");
        setIsError(true);
    });
  }

  const postReset = () => {
    validateForm();
  }

  // Form Validation
  let formError = false;

  const validateForm = async () => {
    const formData = { password, token, userId }

    const isValid = await passwordValidate.validatePassword(password);
    if (isValid) {
      setIsPasswordError(false);
    } else {
      setIsPasswordError(true);
      formError = true;        
    }

    if(formError) {
      setIsErrorHeader("Unable to Reset Password");
      setIsErrorMessage("Please check the fields in red and try again.");
      setIsError(true);
      return;
    } else {
      updatePassword(formData);
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
          Enter your new password below.
        </Message.Content>
      </Message>
      <Segment>
        <Form
          size="large"
        >
          <Popup
            trigger={
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
            }
            header="Password Requirements"
            content={PasswordRequirements}
            on="focus"
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
  formTitle: "Reset Password",
  token: "Invalid",
  userId: "-99"
}

ResetPasswordForm.propTypes = {
  colWidth: PropTypes.number,
  formTitle: PropTypes.string,
  token: PropTypes.string,
  userId: PropTypes.string
}

export default ResetPasswordForm;
