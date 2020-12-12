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

import EmailInput from "./formFields/emailInput";
import ErrorContainer from "./errorContainer";
import SuccessContainer from "./successContainer";

import useForm from "../hooks/useForm";

const ResetPasswordForm = props => {
  const { colWidth, formTitle } = props;

  // State
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);

  // Custom Hooks
  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    values
  } = useForm();

  const handleSubmit = () => {
    if (!isError) {
      postRequest();
    } else {
      // TODO: Return failure
    }
  }

  const postRequest = () => {
    const { email } = values;
    const formData = { email };

    fetch(`${process.env.REACT_APP_API_URL}/api/users/password/reset`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if(data.status !== 200) {
        setIsSuccess(false);
        setIsErrorHeader("Invalid Email Address");
        setIsErrorMessage("Please check the email address you entered and try again.");
        handleServerErrors(...[{ email: true }]);
      } else {
        setIsSuccessHeader("Please Check Your Email");
        setIsSuccessMessage("A message with instructions to reset your password was successfully sent to the email address you entered.");
        setIsSuccess(true);
      }
    }).catch(error => {
        setIsErrorHeader("Something Went Terribly Awry");
        setIsErrorMessage(`Please check your email address and try again. ${error}`);
        handleServerErrors(...[{ email: true }]);
    });
  }

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError && errors.email) {
      setIsErrorHeader("Invalid Email Address");
      setIsErrorMessage("Please check the email address you entered and try again.");
    }
  }, [errors.email, isError]);
  
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
              Enter your email address below and we'll email you a link with instructions to reset your password.
            </Message.Content>
          </Message>
          <Segment>
            <Form
              size="large"
            >
              <EmailInput 
                errors={errors}
                initialValue={values.email}
                placeholder="Email Address"
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
                content="Request Password Reset"
                onClick={handleSubmit}
              >
              </Button>
            </Form>
          </Segment>
        </>
      }
    </Grid.Column>
  );
}

ResetPasswordForm.defaultProps = {
  colWidth: 6,
  formTitle: "Reset Password"
}

const { number, string } = PropTypes;

ResetPasswordForm.propTypes = {
  colWidth: number,
  formTitle: string
}

export default ResetPasswordForm;
