import React, { useState, useEffect } from "react";

import DropdownItems from "./dropdownItems/dropdownItems";
import genderChoices from "../models/genderChoices";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Grid, 
  Header,
  Segment
} from "semantic-ui-react";

const SignupForm = props => {
  const { colWidth, formTitle } = props;

  const [profilePhotographFile, setProfilePhotographFile] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("default");
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

  const uploadFile = e => {
    setProfilePhotographFile(e.target.files[0]);
  }

  const postSignup = () => {

    const formInputs = { 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      gender,
      latitude,
      longitude
    };
      
    const entries = Object.entries(formInputs);
    const formData = new FormData();

    for (const [key, value] of entries) {
      formData.append(key, value);
    }
    // TODO: Clean out the references to profilePhotographFile
    formData.append("profilePhotographFile", profilePhotographFile);
    
    fetch(`${process.env.REACT_APP_API_URL}/api/users/create`, {
      method: "post",
      body: formData
    }).then(response => {
      if(!response.ok) {
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
        console.log("signupForm.js 105 - ERROR");
      }
    }).catch(error => {
      // Set isError to true
      setIsAuth(false);
      setAuthTokens("");
      console.log("signupForm.js 111 - ERROR:\n", error);
    });
  }

  return(
    <Grid.Column width={colWidth}>
      <Header 
        as="h2" 
        textAlign="center"
        color="grey"
      >
        {formTitle}
      </Header>
      <Segment>
        <Form
          size="large"
        >
          <Form.Input
            className="fluid"
            icon="user"
            iconPosition="left"
            name="firstName"
            value={firstName}
            placeholder="First Name"
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
          <Form.Input
            className="fluid"
            icon="user"
            iconPosition="left"
            name="lastName"
            value={lastName}
            placeholder="Last Name"
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
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
            icon="phone"
            iconPosition="left"
            name="phone"
            value={phone}
            placeholder="Telephone Number"
            type="tel"
            onChange={e => {
              setPhone(e.target.value)
            }}
          />
          <Button
            as="label"
            htmlFor="profilePhotographFile"
            className="fluid"
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
            onChange={uploadFile}
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
          <Form.Input
            className="fluid"
            control="select"
            name="gender"
            value={gender}
            onChange={e => {
              setGender(e.target.value)
            }}
          >  
            <option
              key="-1"
              value="default"
              disabled
            >
              Select Your Gender
            </option>
            {genderChoices.map(genderChoice => (
              <DropdownItems 
                key={genderChoice.id}
                value={genderChoice.value}
                text={genderChoice.text}
              />
            ))}
          </Form.Input>
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

export default SignupForm;
