import React, { useState } from "react";

import { 
  Link
} from "react-router-dom";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Grid, 
  Header,
  Message,
  Segment
} from "semantic-ui-react"

// TODO: Split the error container into its own file
const ErrorContainer = props => {
  const { show } = props;
  if(show) {
    return(
      <Message negative>
        <Message.Header>
          Unable to Sign In
        </Message.Header>
        <p>
          Please check your email address and password and try again. 
        </p>
      </Message>
    );
  } else {
    return(null);
  }
}

const LoginForm = props => {
  const { colWidth, formTitle } = props;
  // Set up the state
  const [isError, setIsError] = useState("");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");

  const { setIsAuth, setAuthTokens, setDoRedirect, setRedirectURL } = useAuth();

  const postLogin = () => {
    const formData = { 
      username,
      pass
    };

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
        setIsError(true);
        setPass("");
      }
    }).catch(error => {
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
      <ErrorContainer show={isError} />
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
            placeholder="Your Email Address"
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
            placeholder="Your Password"
            type="password"
            onChange={e => {
              setPass(e.target.value);
            }}
          />
          <Button 
            className="fluid"
            type="button"
            color="red"
            size="large"
            onClick={postLogin}
          >
            Sign In
          </Button>
        </Form>
      </Segment>
      <Message>
        <p>
          Don't have an account yet?
        </p>
        <Link to="/survey">
          <Button
            type="button"
            color="red"
            size="large"
            content="Get Started"
            icon="list alternate"
            labelPosition="left"
          >
          </Button>
        </Link>
      </Message>
    </Grid.Column>
  );
}

export default LoginForm;
