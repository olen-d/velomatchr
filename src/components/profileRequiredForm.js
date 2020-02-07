import React, { useContext, useState, useEffect } from "react";

import auth from "./auth";

import DropdownItems from "./dropdownItems/dropdownItems";
import genderChoices from "../models/genderChoices";

import {
  Button,
  Form,
  Grid, 
  Header,
  Segment
} from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

const ProfileRequiredForm = props => {
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("default");

  const context = useContext(AuthContext);
  const token = context.authTokens;
  const setDoRedirect = context.setDoRedirect;
  const setRedirectURL = context.setRedirectURL;

  const userInfo = auth.getUserInfo(token);

  const postProfileRequired = () => {

    const formData = {
      userId,
      fullName, 
      gender,
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/required/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if(props.submitRedirect) {
        setRedirectURL(props.submitRedirectURL);
        setDoRedirect(true);
      }
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user]);

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
            content={props.submitBtnContent}
            onClick={postProfileRequired}
          >
          </Button>
        </Form>
      </Segment>
    </Grid.Column>
  );
}

export default ProfileRequiredForm;
