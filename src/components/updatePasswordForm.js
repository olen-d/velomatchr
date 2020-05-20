import React, { useContext, useEffect, useState } from "react";
// TODO: import PropTypes from "prop-types";
import auth from "./auth";

import { Button, Form, Header, Segment } from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

import PasswordInput from "./formFields/passwordInput";

import useForm from "../hooks/useForm";

const UpdatePasswordForm = props => {
  const { formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const [isError, setIsError] = useState(false);
  const [userId, setUserId] = useState(null);

  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    values
  } = useForm();

  const context = useContext(AuthContext);
  const token = context.authTokens;
  const setDoRedirect = context.setDoRedirect;
  const setRedirectURL = context.setRedirectURL;

  const userInfo = auth.getUserInfo(token);
  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user]);

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  const handleSubmit = () => {
    if (!isError) {
      postUpdate();
    } else {
      // TODO: return failure
    }
  }
  
  const postUpdate = () => {
    const { password } = values;
    const formData = { userId, password };

    fetch(`${process.env.REACT_APP_API_URL}/api/users/password/change`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.errors) {
        const { errors } = data;
        // setIsSuccess(false);
        // setIsErrorHeader("Unable to Change Password");
        // setIsErrorMessage("Please enter a valid password and try again.")
        handleServerErrors(...errors);
      } else {
        if(submitRedirect) {
          setRedirectURL(submitRedirectURL);
          setDoRedirect(true);
        } else {
          // setIsSuccessHeader("Your Password was Successfully Changed");
          // setIsSuccessMesssage("You can now login using your new password.");
          // setIsSuccess(true);
        }
      }
    })
    .catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  return(
    <>
      <Header 
        as="h2" 
        textAlign="center"
        color="grey"
      >
        {formTitle}
      </Header>
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
            content={submitBtnContent}
            onClick={handleSubmit}
          >
          </Button>
        </Form>
      </Segment>
    </>
  );
}

// TODO: Add prop type checking
// TODO: Add default props

export default UpdatePasswordForm;
