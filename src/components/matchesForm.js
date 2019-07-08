import React, { Component } from "react"

import { 
  Link,
  Redirect
} from "react-router-dom";

import DropdownItems from "./dropdownItems/dropdownItems"
import matchDistances from "../models/matchDistances"

import {
  Button,
  Form,
  Grid, 
  Header,
  Message,
  Segment
} from "semantic-ui-react"

class MatchesForm extends Component {
  state = {
    matchDistances,
    distance: "default",
    user: "",
    pass: "",
    toDashboard: false
  }

  onChange = e => {
    this.setState({ [e.target.name] : e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    const {
      user,
      pass
    } = this.state;

    const formData = { 
      user,
      pass
    };

    // fetch("http://localhost:5000/api/login/submit", {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(formData)
    // }).then(response => {
    //   return response.json();
    // }).then(data => {
    //   if(data.token) {
    //     localStorage.setItem("user_token", data.token);
    //     this.setState({ userToken: data.token, authenticated: data.authenticated, toDashboard: true });
    //     window.location.reload();
        
    //   } else {
    //     localStorage.removeItem("user_token");
    //   }
    // }).catch(error => {
    //   return ({
    //     errorCode: 500,
    //     errorMsg: "Internal Server Error",
    //     errorDetail: error
    //   })
    // });
  }

  render() {
    if (this.state.toDashboard === true)
      {
        return <Redirect to="/home" />
      }
    const {
      distance,
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
              control="select"
              name="distance"
              value={distance}
              onChange={this.onChange}
            >  
              <option
                key="-1"
                value="default"
                disabled
              >
                Select Match Proximity
              </option>
              {this.state.matchDistances.map(matchDistance => (
                <DropdownItems 
                  key={matchDistance.id}
                  value={matchDistance.value}
                  text={matchDistance.text}
                />
              ))}
            </Form.Input>
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

export default MatchesForm;
