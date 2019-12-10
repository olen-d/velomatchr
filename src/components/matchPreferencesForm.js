import React, { Component } from "react"

import { 
  Link,
  Redirect
} from "react-router-dom";

import auth from "./auth";

import DropdownItems from "./dropdownItems/dropdownItems"
import matchDistances from "../models/matchDistances"
import matchGenders from "../models/matchGenders"

import {
  Button,
  Form,
  Grid, 
  Header,
  Segment
} from "semantic-ui-react"

class MatchesForm extends Component {
  state = {
    matchDistances,
    matchGenders,
    distance: "default",
    gender: "default",
    userId: "",
    toRedirect: false
  }

  componentDidMount() {
    const token = auth.getToken();
    const userInfo = auth.getUserInfo(token);
    if (userInfo) {
      this.setState({userId: userInfo.user}); 
    }   
  }

  onChange = e => {
    this.setState({ [e.target.name] : e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    const {
      distance,
      gender
    } = this.state;

    const formData = { 
      userId: this.state.userId,
      distance,
      gender
    };

    fetch("http://localhost:5000/api/matches/preferences/submit", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
        this.setState({ toRedirect: true });
      console.log("Cheetos\n", data);
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  render() {
    if (this.state.toRedirect === true)
      {
        return <Redirect to="/survey" />
      }
    const {
      distance,
      gender,
    } = this.state;

    return(
      <Grid.Column width={this.props.colWidth}>
        <Header 
          as="h2" 
          textAlign="center"
          color="orange"
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
            <Form.Input
              fluid
              control="select"
              name="gender"
              value={gender}
              onChange={this.onChange}
            >  
              <option
                key="-1"
                value="default"
                disabled
              >
                Select Genders to Match With
              </option>
              {this.state.matchGenders.map(matchGender => (
                <DropdownItems 
                  key={matchGender.id}
                  value={matchGender.value}
                  text={matchGender.text}
                />
              ))}
            </Form.Input>
            <Button
              fluid
              type="submit"
              color="red"
              size="large"
              icon="check circle"
              labelPosition="left"
              content={this.props.submitContent}
            >
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
    );
  }
}

export default MatchesForm;
