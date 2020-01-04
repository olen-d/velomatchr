import React, { useContext, useEffect, useState } from "react"

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

import { AuthContext } from "../context/authContext";

const MatchPreferencesForm = props => {
  const [userId, setUserId] = useState(null);
  const [distance, setDistance] = useState("default");
  const [gender, setGender] = useState("default");

  const context = useContext(AuthContext);
  const token = context.authTokens;
  const setToSurvey = context.setToSurvey;

  const userInfo = auth.getUserInfo(token);

  const postMatchPreferences = () => {
    const formData = { 
      userId,
      distance,
      gender
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/matches/preferences/submit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      setToSurvey(true);
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user])

  return(
    <Grid.Column width={props.colWidth}>
      <Header 
        as="h2" 
        textAlign="center"
        color="orange"
      >
        {props.formTitle}
      </Header>
      <Segment>
        <Form 
          size="large"
        >
          <Form.Input
            className="fluid"
            control="select"
            name="distance"
            value={distance}
            onChange={e => {
              setDistance(e.target.value)
            }}
          >  
            <option
              key="-1"
              value="default"
              disabled
            >
              Select Match Proximity
            </option>
            {matchDistances.map(matchDistance => (
              <DropdownItems 
                key={matchDistance.id}
                value={matchDistance.value}
                text={matchDistance.text}
              />
            ))}
          </Form.Input>
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
              Select Genders to Match With
            </option>
            {matchGenders.map(matchGender => (
              <DropdownItems 
                key={matchGender.id}
                value={matchGender.value}
                text={matchGender.text}
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
            content={props.submitContent}
            onClick={postMatchPreferences}
          >
          </Button>
        </Form>
      </Segment>
    </Grid.Column>
  );
  // }
}

export default MatchPreferencesForm;
