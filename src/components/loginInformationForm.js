import React, { useContext, useEffect, useState } from "react";
// TODO: import PropTypes from "prop-types";
import auth from "./auth";

import { Button, Form, Header, Segment } from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

import EmailInput from "./formFields/emailInput";
import PasswordInput from "./formFields/passwordInput";

import useForm from "../hooks/useForm";

const LoginInformationForm = props => {
  const { formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const [initialValues, setInitialValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [isInitialValuesSet, setIsInitalValuesSet] = useState(false);
  const [userId, setUserId] = useState(null);

  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    handleUpdateValues,
    initializeFields,
    values
  } = useForm();

  const context = useContext(AuthContext);
  const token = context.authTokens;
  const setDoRedirect = context.setDoRedirect;
  const setRedirectURL = context.setRedirectURL;

  const userInfo = auth.getUserInfo(token);
  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user]);

  useEffect(() => {
    const getUserAccount = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/account/id/${userId}`);
      const data = await response.json();

      if (data && data.user) { // Skips the destructuring if any of these are null, which would throw a type error
        const {
          user: {
            email
          },
        } = data;

        setInitialValues({
          email
        });
      }
    }
    getUserAccount();
  }, [userId]);

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  if(Object.keys(initialValues).length > 0 && !isInitialValuesSet) {
    initializeFields(initialValues);
    setIsInitalValuesSet(true);
  }

  const handleSubmit = () => {
    if (!isError) {
      postUpdate();
    } else {
      // TODO: return failure
    }
  }
  
  const postUpdate = () => {
    //
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
          <EmailInput 
            errors={errors}
            initialValue={values.email}
            placeholder="Email Address"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
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

export default LoginInformationForm;
