import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Grid, 
  Header,
  Segment
} from "semantic-ui-react";

// Components
import EmailInput from "./formFields/emailInput";
import ErrorContainer from "./errorContainer";
import MatchesNearMe from "./matchesNearMe";
import PasswordInput from "./formFields/passwordInput"

// Helpers
import locator from "../helpers/locator";

// Hooks
import useForm from "../hooks/useForm";

const SignupRequiredForm = props => {
  const { colWidth, formTitle } = props;
  
  // State
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);

  // Hooks
  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    values
  } = useForm();

  const { setIsAuth, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();

  useEffect(() => {
    locator.locator().then(locatorRes => {
      if (locatorRes.status === 200) {
        setLatitude(locatorRes.latitude);
        setLongitude(locatorRes.longitude);
      } else {
        // TODO: Modal to get user address if they decline geolocation
      }
    });
  }, []);

  const createUser = async formData => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/create`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.status !== 200) {
        const { errors: serverErrors } = data;
        serverErrors.forEach(error => {
          handleServerErrors(...[error]);
        });
      } else {
        if (data.tokens) {
          const { authenticated, tokens: { access_token: token, refresh_token: refreshToken }, } = data; // token_type: tokenType

          localStorage.setItem("user_refresh_token", JSON.stringify(refreshToken));
          
          setIsAuth(authenticated);
          setAccessToken(token);
          setRedirectURL("/onboarding/profile")
          setDoRedirect(true);
        } else {
          setIsAuth(false);
          setAccessToken("");
          console.log("signupRequiredForm.js ~129 - ERROR: Missing Token");
        }          
      }    
    } catch(error) {
      setIsAuth(false);
      setAccessToken("");
      console.log("Error:", error);
    }
  }

  const handleSubmit = () => {
    if (!isError) {
      const { email, password } = values;

      const formData = { 
        email: email.toLowerCase(),
        password,
        latitude,
        longitude
      }
      createUser(formData);
    } else {
      // TODO: Consider shaking the screen or some other visual notification that the form didn't validate
    }
  }

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError) {
      if (errors.email) {
        setIsErrorHeader("Invalid Email Address");
        setIsErrorMessage("Please check the email address you entered and try again.");
      }
      if (errors.password) {
        setIsErrorHeader("Invalid Password");
        setIsErrorMessage("Please make sure the password you entered meets the requirements and try again. ");
      }
    }
  }, [errors.email, errors.password, isError]);

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
          <PasswordInput 
            errors={errors}
            initialValue={values.password}
            placeholder="Password"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <Button
            disabled={!values.email || !values.password}
            className="fluid"
            type="button"
            color="red"
            size="large"
            icon="check circle"
            labelPosition="left"
            content="Sign Up"
            onClick={handleSubmit}
          >
          </Button>
        </Form>
      </Segment>
      <MatchesNearMe
        latitude={latitude}
        longitude={longitude}
        show={true}
      />
    </Grid.Column>
  );
}

SignupRequiredForm.defaultProps = {
  colWidth: 6,
  formTitle: "Sign Up"
}

const { number, string } = PropTypes;

SignupRequiredForm.propTypes = {
  colWidth: number,
  formTitle: string
}

export default SignupRequiredForm;
