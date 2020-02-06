import React, { useState, useEffect } from "react";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Grid, 
  Header,
  Segment
} from "semantic-ui-react";

const SignupRequiredForm = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState("0.0");

  const { setIsAuth, setAuthTokens, setToMatchPrefs } = useAuth();

  useEffect(() => {
    locater().then(locaterRes => {
      if (locaterRes.status === 200) {
        setLatitude(locaterRes.latitude);
        setLongitude(locaterRes.longitude);
      }
    });
  }, []);

  const locater = () => {
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

  const postSignup = () => {
    const formInputs = { 
      email,
      password,
      latitude,
      longitude
    };
      
    const entries = Object.entries(formInputs);
    const formData = new FormData();

    for (const [key, value] of entries) {
      formData.append(key, value);
    }
    
    fetch(`${process.env.REACT_APP_API_URL}/api/users/create`, {
      method: "post",
      body: formData
    }).then(response => {
      if(!response.ok) {
        console.log(response);
        throw new Error ("Network response was not ok.");
      }
      return response.json();
    }).then(data => {
      if(data.token) {
        localStorage.setItem("user_token", JSON.stringify(data.token));
        setIsAuth(data.authenticated);
        setAuthTokens(data.token);
        setToMatchPrefs(true);
      } else {
        setIsAuth(false);
        setAuthTokens("");
        console.log("signupRequiredForm.js 89 - ERROR");
      }
    }).catch(error => {
      // Set isError to true
      setIsAuth(false);
      setAuthTokens("");
      console.log("signupRequiredForm.js 95 - ERROR:\n", error);
    });
  }

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
        >
          <Form.Input
            className="fluid"
            icon="envelope"
            iconPosition="left"
            name="email"
            value={email}
            placeholder="Email Address"
            type="email"
            onChange={e => {
              setEmail(e.target.value)
            }}
          />
          <Form.Input
            className="fluid"
            icon="lock"
            iconPosition="left"
            name="password"
            value={password}
            placeholder="Password"
            type="password"
            onChange={e => {
              setPassword(e.target.value)
            }}
          />
          <Button
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
    </Grid.Column>
  );
}

export default SignupRequiredForm;
