import React, { useState } from "react"

import { 
  Link,
  Redirect
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

const LoginForm = props => {
  // Set up the state
  const [toDashboard, setToDashboard] = useState(false);
  const [isError, setIsError] = useState(false);
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");

  const { setAuthTokens } = useAuth();

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
        setAuthTokens(data.token);
        setToDashboard("ChainsawDeath");
      } else {
        // localStorage.removeItem("user_token");
        setIsError(true);
      }
    }).catch(error => {
        setIsError(true);
    });
  }

  if(toDashboard) {
    return <Redirect to="/" />;
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
      <Segment>
        <Form 
          size="large"
          // onSubmit={this.onSubmit}
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
            type="submit"
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
