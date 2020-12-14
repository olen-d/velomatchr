import React, { useEffect, useState } from "react";
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
import LoginForm from "./loginForm";
import PasswordInput from "./formFields/passwordInput";
import SuccessContainer from "./successContainer";

import useForm from "../hooks/useForm";

const ResetPasswordForm = props => {
  const { colWidth, formTitle, token, userId } = props;

  // State
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);

  // Hooks
  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    values
  } = useForm();

  const handleSubmit = () => {
    if (!isError) {
      postNewPassword();
    } else {
      // TODO: Return failure
    }
  }

  const postNewPassword = () => {
    const { password } = values;
    const formData = { password, token, userId };

    fetch(`${process.env.REACT_APP_API_URL}/api/users/password/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data.status !== 200) {
        setIsSuccess(false);
        setIsErrorHeader("Unable to Change Password");
        setIsErrorMessage("Please enter a valid password and try again.")
        handleServerErrors(...[{ password: true }]);
      } else {
        if(data.data && data.data[0] === 1) {
          setIsSuccessHeader("Your Password was Successfully Reset");
          setIsSuccessMessage(`You can now login using your new password.`);
          setIsSuccess(true);
        } else {
          setIsErrorHeader("Unable to Reset Password");
          setIsErrorMessage("Something went terribly awry. Please try again." + JSON.stringify(data.error));
          setIsError(true);
        }
      }
    }).catch(error => {
        setIsErrorHeader("Unable to Reset Password");
        setIsErrorMessage("Something went terribly awry. Please try again." + JSON.stringify(error));
        setIsError(true);
    });
  }

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError && errors.password) {
      setIsErrorHeader("Invalid Password");
      setIsErrorMessage("Please enter a valid password and try again.");
    }
  }, [errors.password, isError]);

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
      {!isSuccess &&
        <>
          <Message>
            <Message.Content>
              Enter your new password below.
            </Message.Content>
          </Message>
          <Segment>
            <Form size="large">
              <PasswordInput 
                errors={errors}
                initialValue={values.password}
                placeholder="Password"
                handleBlur={handleBlur}
                handleChange={handleChange}
                values={values}
              />
              <Button
                disabled={isError}
                className="fluid"
                type="button"
                color="red"
                size="large"
                icon="check circle"
                labelPosition="left"
                content="Reset Password"
                onClick={handleSubmit}
              >
              </Button>
            </Form>
          </Segment>
        </>
      }
      {isSuccess && <LoginForm />}
    </Grid.Column>
  );
}

ResetPasswordForm.defaultProps = {
  colWidth: 6,
  formTitle: "Reset Password",
  token: "Invalid",
  userId: "-99"
}

const { number, string } = PropTypes;

ResetPasswordForm.propTypes = {
  colWidth: number,
  formTitle: string,
  token: string,
  userId: string
}

export default ResetPasswordForm;
