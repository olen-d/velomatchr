import React, { useState } from "react";
import PropTypes from "prop-types";

import { 
  Link
} from "react-router-dom";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Grid, 
  Header,
  Segment
} from "semantic-ui-react"

import ErrorContainer from "./errorContainer";

const forgotStyle = {
  marginTop: "1.25rem",
  marginBottom: "0.5rem"
}

const LoginForm = props => {
  const { colWidth, formTitle } = props;

  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  // ...Rest of the State
  const [pass, setPass] = useState("");
  const [username, setUsername] = useState("");

  const { setIsAuth, setAuthTokens, setDoRedirect, setRedirectURL } = useAuth();

  const postLogin = () => {
    const formData = { 
      username: username.toLowerCase(),
      pass
    };

    // Form Validation
    let formError = false;

    if(formError)
      {
        setIsErrorHeader("Unable to Sign In");
        setIsErrorMessage("Please check the fields in red and try again.");
        setIsError(true);
        return;
      }

    fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if(data.token) {
        localStorage.setItem("user_token", JSON.stringify(data.token));
        setIsAuth(data.authenticated);
        setAuthTokens(data.token);
        setRedirectURL("/dashboard");
        setDoRedirect(true);
      } else {
        localStorage.removeItem("user_token");
        setIsErrorHeader("Unable to Sign In");
        setIsErrorMessage("Please check your email address and password and try again.");
        setIsError(true);
        setPass("");
      }
    }).catch(error => {
        setIsErrorHeader("Unable to Sign In");
        setIsErrorMessage("Please check your email address and password and try again.");
        setIsError(true);
    });
  }

  // And now we make the JSX...
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
            name="username"
            value={username}
            placeholder="Email Address"
            error={isError}
            onChange={e => {
              setUsername(e.target.value);
            }}
          />
          <Form.Input
            className="fluid"
            icon="lock"
            iconPosition="left"
            name="pass"
            value={pass}
            placeholder="Password"
            type="password"
            error={isError}
            onChange={e => {
              setPass(e.target.value);
            }}
          />
          <Button
            disabled={!pass || !username}
            className="fluid"
            type="button"
            color="red"
            size="large"
            icon="check circle"
            labelPosition="left"
            content="Sign In"
            onClick={postLogin}
          >
          </Button>
        </Form>
        <p style={forgotStyle}>
          <Link to="/login/request-password-reset">
            Forgot your password?
          </Link>
        </p>
      </Segment>
      <Segment>
        <p>
          Don't have an account yet?
        </p>
        <Link to="/signup">
          <Button
            basic
            className="fluid"
            type="button"
            color="red"
            size="large"
            content="Get Started"
            icon="list alternate"
            labelPosition="left"
          >
          </Button>
        </Link>
      </Segment>
    </Grid.Column>
  );
}

LoginForm.defaultProps = {
  colWidth: 6,
  formTitle: "Sign In"
}

const { number, string } = PropTypes;

LoginForm.propTypes = {
  colWidth: number,
  formTitle: string
}

export default LoginForm;
