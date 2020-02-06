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
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("default");

  const { setIsAuth, setAuthTokens, setToMatchPrefs } = useAuth();

  const postSignup = () => {

    const formInputs = { 
      fullName, 
      gender,
    };
      
    const entries = Object.entries(formInputs);
    const formData = new FormData();

    for (const [key, value] of entries) {
      formData.append(key, value);
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/user/profile/submit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if(props.toSurvey) {
        setToSurvey(true);
      }
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
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
            icon="user"
            iconPosition="left"
            name="firstName"
            value={fullName}
            placeholder="First and Last Name"
            onChange={e => {
              setFullName(e.target.value)
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
