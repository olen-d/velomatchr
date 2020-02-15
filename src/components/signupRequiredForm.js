import React, { useState, useEffect } from "react";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Grid, 
  Header,
  Segment
} from "semantic-ui-react";

import ErrorContainer from "./errorContainer";

const SignupRequiredForm = props => {
  const { colWidth, formTitle } = props;
  
  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  // ...Rest of the State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);

  const { setIsAuth, setAuthTokens, setDoRedirect, setRedirectURL } = useAuth();

  useEffect(() => {
    locater().then(locaterRes => {
      if (locaterRes.status === 200) {
        setLatitude(locaterRes.latitude);
        setLongitude(locaterRes.longitude);
      }
    });
  }, []);

  const locater = () => {
    return new Promise((res, rej) => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            res({
              status: 200,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            // TODO: Return the number of nearby matches (within 5 miles)
          });
        } else {
          /* geolocation IS NOT available */
          // Ask for a city and state
          // Then hit (probably) MapQuest to generate a lat/long
          // In the database note that it was city/state and not accurate
        }
      } catch (err) {
        rej({
          status: 500,
          error: "Internal server error. Failed to get latitude and longitude of user."
        });
      }
    });
  }

  const postSignup = () => {
    const formData = { 
      email,
      password,
      latitude,
      longitude
    };
 
    // Form Validation
    let formError = false;
  
    // Basic regular expression email validation
    const expression = /.+@.+\..+/i;
    if(expression.test(String(email).toLowerCase())) {
      setIsEmailError(false);
    } else {
      setIsEmailError(true);
      formError = true;
    }
  
    if(password.length < 6) {
      setIsPasswordError(true);
      formError = true;
    } else {
      setIsPasswordError(false);
    }

    if(formError)
      {
        setIsErrorHeader("Unable to Sign Up");
        setIsErrorMessage("Please check the fields in red and try again.");
        setIsError(true);
        return;
      }

    fetch(`${process.env.REACT_APP_API_URL}/api/users/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      if(!response.ok) {
        throw new Error ("Network response was not ok.");
      }
      return response.json();
    }).then(data => {
      if(data.token) {
        localStorage.setItem("user_token", JSON.stringify(data.token));
        setIsAuth(data.authenticated);
        setAuthTokens(data.token);
        setRedirectURL("/onboarding/profile")
        setDoRedirect(true);
      } else {
        setIsAuth(false);
        setAuthTokens("");
        console.log("signupRequiredForm.js 86 - ERROR");
      }
    }).catch(error => {
      // Set isError to true
      setIsAuth(false);
      setAuthTokens("");
      console.log("signupRequiredForm.js 92 - ERROR:\n", error);
    });
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
          <Form.Input
            className="fluid"
            icon="lock"
            iconPosition="left"
            name="password"
            value={password}
            placeholder="Password"
            type="password"
            error={isPasswordError}
            onChange={e => {
              setPassword(e.target.value)
            }}
          />
          <Button
            disabled={!email || !password}
            className="fluid"
            type="button"
            color="red"
            size="large"
            icon="check circle"
            labelPosition="left"
            content="Sign Up"
            onClick={postSignup}
          >
          </Button>
        </Form>
      </Segment>
    </Grid.Column>
  );
}

export default SignupRequiredForm;
