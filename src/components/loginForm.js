import React, { useState, useEffect } from "react"

import { 
  Link,
  Redirect
} from "react-router-dom";

import { useAuth } from "../context/authContext";
import { useRedirect } from "../context/redirectContext";

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

  const postLogin = e => {
    e.preventDefault();

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
        // return <Redirect to="/" />;
        // this.props.history.push('/dashboard');
        setToDashboard(true);
        console.log("TD ",toDashboard);
      } else {
        // localStorage.removeItem("user_token");
        setIsError(true);
      }
    }).catch(error => {
        setIsError(true);
    });
  }

  // useEffect(() => {
  //   console.log("TD2: ", toDashboard);
  //   if(toDashboard) {
  //     console.log("REDIR");
  //     return <Redirect to="/" />;
  //   }
  // }, [toDashboard]);

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
        {username}
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
