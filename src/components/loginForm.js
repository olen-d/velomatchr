import React, { Component } from "react"

import { 
  Link,
  Redirect
} from "react-router-dom";

import {
  Button,
  Form,
  Grid, 
  Header,
  Message,
  Segment
} from "semantic-ui-react"

class LoginForm extends Component {
  state = {
    username: "",
    pass: "",
    toDashboard: false
  }

  onChange = e => {
    this.setState({ [e.target.name] : e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    const {
      username,
      pass
    } = this.state;

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
    }).then(data => { console.log("DATA\n",data)
      if(data.token) {
        localStorage.setItem("user_token", data.token);
        this.setState({ userToken: data.token, authenticated: data.authenticated, toDashboard: true });
        window.location.reload();
      } else {
        localStorage.removeItem("user_token");
      }
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  render() {
    if (this.state.toDashboard === true)
      {
        return <Redirect to="/home" />
      }
    const {
      username,
      pass
    } = this.state;

    return(
      <Grid.Column width={this.props.colWidth}>
        <Header 
          as="h2" 
          textAlign="center"
          color="grey"
        >
          {this.props.formTitle}
        </Header>
        <Segment>
          <Form 
            size="large"
            onSubmit={this.onSubmit}
          >
            <Form.Input
              fluid
              icon="envelope"
              iconPosition="left"
              name="username"
              value={username}
              placeholder="Your Email Address"
              onChange={this.onChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              name="pass"
              value={pass}
              placeholder="Your Password"
              type="password"
              onChange={this.onChange}
            />
            <Button
              fluid
              type="submit" 
              color="red"
              size="large"
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
}

export default LoginForm;
