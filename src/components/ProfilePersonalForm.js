import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";

import * as auth from "./auth";

import { Button, Form, Header, Segment } from "semantic-ui-react";

import { useAuth } from "../context/authContext";

import ErrorContainer from "./errorContainer";
import FullnameInput from "./formFields/fullnameInput";
import GenderInput from "./formFields/genderInput";
import PhoneInput from "./formFields/phoneInput";
import UsernameInput from "./formFields/usernameInput";

import useForm from "../hooks/useForm";

const ProfilePersonalForm = props => {

  const { formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const [flag, setFlag] = useState(true);
  const [initialValues, setInitialValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isFetchError, setIsFetchError] = useState(false);
  const [isFetchErrorHeader, setIsFetchErrorHeader] = useState(null);
  const [isFetchErrorMessage, setIsFetchErrorMessage] = useState(null);
  const [userId, setUserId] = useState(null);

  const { errors, handleBlur, handleChange, handleServerErrors, initializeFields, values } = useForm();
  const { accessToken, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();

  const { user } = auth.getUserInfo(accessToken);

  // TODO: Consider pulling these out into the useForm hook...
  const errorMsgFullname = "Please enter a name with at least two characters.";
  const errorMsgUsername = "Please enter a valid username.";

  if(Object.keys(initialValues).length > 0 && flag) {
    initializeFields(initialValues);
    setFlag(false);
  }

  const handleSubmit = () => {
    if (!isError) {
      postProfilePersonalUpdate();
    } else {
      // TODO: Return Failure
    }
  }

  const postProfilePersonalUpdate = async () => {
    const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, user);
    if (isNewAccessToken) { setAccessToken(token); }

    const {
      fullname,
      gender,
      phone,
      username: name
    } = values;
 
    const formData = {
      userId,
      fullname,
      gender,
      phone,
      name
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/personal-information`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = response.ok ? await response.json() : false;

      if (data.errors) {
        const { errors } = data;
        // TODO: fix profileRequiredForm.js 
        handleServerErrors(...errors);
      } else {
        if(submitRedirect) {
          setRedirectURL(submitRedirectURL);
          setDoRedirect(true);
        }
      }
    } catch (error) {
      setIsFetchErrorHeader("Unable To Update Your Personal Information");
      setIsFetchErrorMessage("Please wait a few minutes and try again.");
      setIsFetchError(true);
    }
  }

  // Hooks

  useEffect(() => { setUserId(user) }, [user]);

  useEffect(() => {
    if (userId) {
      (async () => {
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/personal-information/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.status === 200 ? await response.json() : false;

        if (data && data.data) { // Skips the destructuring if any of these are null, which would throw a type error
          const {
            data: {
              firstName,
              gender,
              lastName,
              name: username,
              phone
            },
          } = data;

          const fullname = firstName || lastName ? `${firstName} ${lastName}` : "";

          setInitialValues({
            fullname,
            gender,
            username,
            phone
          });

          setIsFetchError(false);
        } else {
            setIsFetchErrorHeader("Unable to Retrieve Your Location Information");
            setIsFetchErrorMessage("Please reload the page to try again.");
            setIsFetchError(true);
        }
      })();
    }
  }, [accessToken, setAccessToken, userId]);

  useEffect(() => {
    if (Object.values(errors).indexOf(true) > -1) {
      const headers = { fullname: "Full Name", username: "Username"};
      const messages = { fullname: errorMsgFullname, username: errorMsgUsername };
      const areErrors = Object.entries(errors).filter(([, value]) => value === true);
      const errorNames = areErrors.flat().filter(error => error !== true);

      // Loop through the object and add to the header and message
      let errorHeaders = "Invalid ";
      let errorMessages = "";

      errorNames.forEach(element => {
        errorHeaders += headers[element] + " and ";
        errorMessages += messages[element] + " ";
      })

      // Figure out the error fullname, username
      // Correctly set the header
      setIsErrorHeader(errorHeaders.slice(0, -5));
      setIsErrorMessage(errorMessages.slice(0, -1));
      setIsError(true)
    } else {
      setIsError(false);
    }
  }, [errors]);

  return(
    <div className="profilePersonalForm">
      <Header 
        as="h2" 
        textAlign="left"
        color="grey"
      >
        {formTitle}
      </Header>
      <ErrorContainer
        header={isErrorHeader}
        message={isErrorMessage}
        show={isError}
      >
      </ErrorContainer>
      <ErrorContainer
        header={isFetchErrorHeader}
        message={isFetchErrorMessage}
        show={isFetchError}
      >
      </ErrorContainer>
      <Segment>
        <Form size="large">
          <UsernameInput 
            errors={errors}
            initialValue={values.fullname}
            placeholder="User Name"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <FullnameInput
            errors={errors}
            initialValue={values.fullname}
            placeholder="First and Last Name"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <GenderInput 
            errors={errors}
            initialValue={values.gender} 
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <PhoneInput
            errors={errors}
            initialValue={values.phone}
            placeholder="Phone Number"
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
    </div>
  );
}

ProfilePersonalForm.defaultProps = {
  formTitle: "My Personal Information",
  submitBtnContent: "Update Personal Information",
  submitRedirect: true,
  submitRedirectURL: "/dashboard"
}

const { bool, string } = PropTypes;

ProfilePersonalForm.propTypes = {
  formTitle: string,
  submitBtnContent: string,
  submitRedirect: bool,
  submitRedirectURL: string
}

export default ProfilePersonalForm;
