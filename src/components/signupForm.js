import React, { Component } from "react"

import { 
  Link,
  Redirect
} from "react-router-dom";

import DropdownItems from "./dropdownItems/dropdownItems"
import genderChoices from "../models/genderChoices"

import {
  Button,
  Form,
  Grid, 
  Header,
  Segment
} from "semantic-ui-react"

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderChoices,
      profilePhotographFile: "",
      firstName: "",
      lastName: "",
      emailAddress: "",
      telephoneNumber: "",
      password: "",
      gender: "default",
      latitude: 0.0,
      longitude: 0.0,
      userToken: "",
      authenticated: false,
      toRedirect: false
    }
  }
  
  componentDidMount() {
    this.locater().then(locaterRes => {
      if (locaterRes.status === 200) {
        this.setState({ latitude : locaterRes.latitude });
        this.setState({ longitude : locaterRes.longitude });
      }
    });    
  }

  locater = () => {
    return new Promise((res, rej) => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            res({
              status: 200,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            // Return the number of nearby matches (within 5 miles)
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

  onChange = e => {
    this.setState({ [e.target.name] : e.target.value });
  }

  uploadFile = e => {
    this.setState({ profilePhotographFile : e.target.files[0] });
  }

  onSubmit = e => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      emailAddress,
      telephoneNumber,
      password,
      gender,
      latitude,
      longitude
    } = this.state;

    const formInputs = { 
      firstName, 
      lastName, 
      emailAddress, 
      telephoneNumber, 
      password, 
      gender,
      latitude,
      longitude
    };
      
    const entries = Object.entries(formInputs);
    const profilePhotographFile = this.state.profilePhotographFile;

    const formData = new FormData();

    for (const [key, value] of entries) {
      formData.append(key, value);
    }

    formData.append("profilePhotographFile", profilePhotographFile);

    fetch("http://localhost:5000/api/signup", {
      method: "post",
      body: formData
    }).then(response => {
      return response.json();
    }).then(data => {
      if(data.token) {
        localStorage.setItem("user_token", data.token);
        this.setState({ userToken: data.token, authenticated: data.authenticated, toRedirect: true });
      }
    });
  }

  render() {
    if (this.state.toRedirect === true)
    {
      return <Redirect to="/matches/preferences" />
    }
    const {
      firstName,
      lastName,
      emailAddress,
      telephoneNumber,
      password,
      gender
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
              icon="user"
              iconPosition="left"
              name="firstName"
              value={firstName}
              placeholder="First Name"
              onChange={this.onChange}
            />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              name="lastName"
              value={lastName}
              placeholder="Last Name"
              onChange={this.onChange}
            />
            <Form.Input
              fluid
              icon="envelope"
              iconPosition="left"
              name="emailAddress"
              value={emailAddress}
              placeholder="Email Address"
              type="email"
              onChange={this.onChange}
            />
            <Form.Input
              fluid
              icon="phone"
              iconPosition="left"
              name="telephoneNumber"
              value={telephoneNumber}
              placeholder="Telephone Number"
              type="tel"
              onChange={this.onChange}
            />
            <Button
              as="label"
              htmlFor="profilePhotographFile"
              fluid
              type="button"
              color="grey"
              size="large"
              icon="image"
              labelPosition="left"
              content="Profile Photograph"
            >
            </Button>
            <input
              type="file"
              id="profilePhotographFile"
              name="profilePhotographFile"
              style={{ display: "none" }}
              onChange={this.uploadFile}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              name="password"
              value={password}
              placeholder="Password"
              type="password"
              onChange={this.onChange}
            />
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
                Select Your Gender
              </option>
              {this.state.genderChoices.map(genderChoice => (
                <DropdownItems 
                  key={genderChoice.id}
                  value={genderChoice.value}
                  text={genderChoice.text}
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
              content="Sign Up"
            >
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
    );
  }
}

export default SignupForm;
