import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Grid, 
  Header,
  Popup,
  Segment
} from "semantic-ui-react";

import ErrorContainer from "./errorContainer";
import MatchesNearMe from "./matchesNearMe";
import PasswordRequirements from "./passwordRequirements";

import locater from "../helpers/locater";
import passwordValidate from "../helpers/password-validate";

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
    locater.locater().then(locaterRes => {
      if (locaterRes.status === 200) {
        setLatitude(locaterRes.latitude);
        setLongitude(locaterRes.longitude);
      } else {
        // TODO: Modal to get user address if they decline geolocation
      }
    });
  }, []);



  const createUser = formData => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {

        // There was a validation issue
        const { errors } = data;
        errors.forEach(e => {
          if (e["error"] === "IVE") {
            setIsEmailError(true);
            formError = true;
          } else {
            setIsEmailError(false);
          }
          if (e["error"] === "IVP") {
            setIsPasswordError(true);
            formError = true;
          } else {
            setIsPasswordError(false);
          }
        });
      } else {
        if (data.token) {
          localStorage.setItem("user_token", JSON.stringify(data.token));
          setIsAuth(data.authenticated);
          setAuthTokens(data.token);
          setRedirectURL("/onboarding/profile")
          setDoRedirect(true);
        } else {
          setIsAuth(false);
          setAuthTokens("");
          console.log("signupRequiredForm.js ~129 - ERROR: Missing Token");
        }          
      }
    }).catch(error => {
      // Set isError to true
      setIsAuth(false);
      setAuthTokens("");
      console.log("signupRequiredForm.js ~136 - ERROR:\n", error);
    });      
  }
  
  const postSignup = () => {
    validateForm();
  }
  // Form Validation
  let formError = false;

  const checkEmail = async () => {
    const expression = /.+@.+\..+/i;
    if(expression.test(String(email).toLowerCase())) {
      const result = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/check-mx/${email}`);
      const data = await result.json();
      const { mxExists } = data;

      if(mxExists) {
        setIsEmailError(false);
      } else {
        setIsEmailError(true);
        formError = true
      }
    } else {
      setIsEmailError(true);
      formError = true;
    }
  };

  const validateForm = async() => {
    const formData = { 
      email: email.toLowerCase(),
      password,
      latitude,
      longitude
    };

    await checkEmail();
    const isValid = await passwordValidate.validatePassword(password);
    if (isValid) {
      setIsPasswordError(false);
    } else {
      setIsPasswordError(true);
      formError = true;        
    }

    if (formError) {
      setIsErrorHeader("Unable to Sign Up");
      setIsErrorMessage("Please check the fields in red and try again.");
      setIsError(true);
      return;
    } else {
      createUser(formData);
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
