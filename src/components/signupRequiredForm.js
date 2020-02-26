import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Grid, 
  Header,
  List,
  Popup,
  Segment
} from "semantic-ui-react";

import ErrorContainer from "./errorContainer";
import MatchesNearMe from "./matchesNearMe";

import passwordValidate from "../helpers/password-validate";

const PasswordRequirements = () => (
  <List>
    <List.Item>
      <List.Icon name="check" verticalAlign="middle"></List.Icon>
      <List.Content verticalAlign="middle">At least eight characters long</List.Content>
    </List.Item>
    <List.Item>
      <List.Icon name="check" verticalAlign="middle"></List.Icon>
      <List.Content verticalAlign="middle">Upper and lowercase letters</List.Content>
    </List.Item>
    <List.Item>
      <List.Icon name="check" verticalAlign="middle"></List.Icon>
      <List.Content verticalAlign="middle">At least one number or special character</List.Content>
    </List.Item>
  </List>
)

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

  const createUser = formData => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      if (!response.ok) {
        throw new Error ("Network response was not ok.");
      }
      return response.json();
    }).then(data => {
      if (data.error) {
        switch (data.error) {
          case "IVP":
            setIsPasswordError(true);
            break;
        
          default:
            break;
        }
      }
      if (data.token) {
        localStorage.setItem("user_token", JSON.stringify(data.token));
        setIsAuth(data.authenticated);
        setAuthTokens(data.token);
        setRedirectURL("/onboarding/profile")
        setDoRedirect(true);
      } else {
        setIsAuth(false);
        setAuthTokens("");
        console.log("signupRequiredForm.js ~173 - ERROR: Missing Token");
      }
    }).catch(error => {
      // Set isError to true
      setIsAuth(false);
      setAuthTokens("");
      console.log("signupRequiredForm.js ~179 - ERROR:\n", error);
    });      
  }
  
  const postSignup = () => {
    const formData = { 
      email: email.toLowerCase(),
      password,
      latitude,
      longitude
    };
 
    // Form Validation
    let formError = false;
  
    // Basic regular expression email validation
    const expression = /.+@.+\..+/i;
    if(expression.test(String(email).toLowerCase())) {
      // Email is generally acceptable, now let's check and see if the server has an MX record
      fetch(`${process.env.REACT_APP_API_URL}/api/mail/check-mx/${email}`).then(result => {
        result.json().then(result => {
          const { mxExists } = result;

          if(mxExists) {
            setIsEmailError(false);
          } else {
            setIsEmailError(true);
            formError = true
          }
          console.log("MXEXISTS form Error", formError);
          return("MXFORM RES")
        })
        .then(result => {
          console.log("Password Validate Form Error:", formError, result);
          passwordValidate.validatePassword(password).then(isValid => {
            if (isValid) {
              setIsPasswordError(false);
            } else {
              setIsPasswordError(true);
              formError = true;        
            }
            return("PVALID RES")
          })
          .then(result => {
            if (formError) {
              setIsErrorHeader("Unable to Sign Up");
              setIsErrorMessage("Please check the fields in red and try again.");
              setIsError(true);
              return;
            } else {
              console.log("IMPORTANT",formError, result);
              // createUser(formData);
            }
        
          })
          .catch(error => {
            setIsPasswordError(true);
            formError = true;
          });
      })
      
      })
      .catch(error => {
        // TODO: Deal with the error
        console.log("signupRequiredForm.js ~97 - ERROR:\n" + error);
        setIsEmailError(true);
        formError=true;
      })
    } else {
      setIsEmailError(true);
      formError = true;
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
          <Popup
            trigger={
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
            }
            header="Password Requirements"
            content={PasswordRequirements}
            on="focus"
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

SignupRequiredForm.propTypes = {
  colWidth: PropTypes.number,
  formTitle: PropTypes.string
}

export default SignupRequiredForm;
