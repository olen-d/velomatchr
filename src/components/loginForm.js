import React, { useState } from "react"

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

// TODO: Split the error container into its oqn file
const ErrorContainer = props => {
  return(
    <Message negative>
      <Message.Header>
        Unable to Sign Im
      </Message.Header>
    </Message>
  );
}

const LoginForm = props => {
  // Set up the state
  const [isError, setIsError] = useState(false);
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");

  const { setAuthTokens } = useAuth();

  const postLogin = e => {
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
        setAuthTokens(data.token);
      } else {
        localStorage.removeItem("user_token");
        setIsError(true);
      }
    }).catch(error => {
        setIsError(true);
    });
  }

  // And now we make the JSX...
  return(
    <Grid.Column width={props.colWidth}>
      <Header 
        as="h2" 
        textAlign="center"
        color="grey"
      >
        {props.formTitle}
      </Header>
      {({ isError }) => (
        isError ? <ErrorContainer /> : null
      )}
      <Segment>
        <Form 
          size="large"
        >
          <Form.Input
            fluid
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
            fluid
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
            fluid
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
