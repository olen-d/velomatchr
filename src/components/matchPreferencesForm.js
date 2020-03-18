import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

import auth from "./auth";

import DropdownItems from "./dropdownItems/dropdownItems";

import matchDistances from "../models/matchDistances";
import matchGenders from "../models/matchGenders";

import {
  Button,
  Form,
  Grid, 
  Header,
  Message,
  Segment
} from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

import ErrorContainer from "./errorContainer";

const MatchPreferencesForm = props => {
  const { colWidth, formInstructions, formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isDistanceError, setIsDistanceError] = useState(false);
  const [isGenderError, setIsGenderError] = useState(false);
  // ...Rest of the State
  const [userId, setUserId] = useState(null);
  const [distance, setDistance] = useState("default");
  const [gender, setGender] = useState("default");

  const context = useContext(AuthContext);
  const token = context.authTokens;
  const setDoRedirect = context.setDoRedirect;
  const setRedirectURL = context.setRedirectURL;

  const userInfo = auth.getUserInfo(token);

  const postMatchPreferences = () => {
    const formData = { 
      userId,
      distance,
      gender
    };

    // Form Validation
    let formError = false;

    if(distance === "default") {
      setIsDistanceError(true);
      formError = true;
    } else {
      setIsDistanceError(false);
    }
    if(gender === "default") {
      setIsGenderError(true);
      formError = true;
    } else {
      setIsGenderError(false);
    }

    if(formError)
      {
        setIsErrorHeader("Unable to save your match preferences");
        setIsErrorMessage("Please check the fields in red and try again.");
        setIsError(true);
        return;
      }

    fetch(`${process.env.REACT_APP_API_URL}/api/matches/preferences/submit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if(submitRedirect) {
        setRedirectURL(submitRedirectURL);
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

  useEffect(() => {
    const getUserMatchPrefs = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/matches/preferences/${userId}`);
      const data = await response.json();

      if (data && data.user && data.user.userMatchPrefs) { // Skips the destructuring if any of these are null, which would throw a type error
        const { user: { userMatchPrefs: { distance: userDistance, gender: userGender },},} = data;
        setDistance(userDistance);
        setGender(userGender);
      }
    }
    getUserMatchPrefs();
  }, [userId]);

  return(
    <Grid.Column width={colWidth}>
      <Header 
        as="h2" 
        textAlign="center"
        color="grey"
      >
        {formTitle}
      </Header>
      <Message>
        {formInstructions}
      </Message>
      <ErrorContainer
        header={isErrorHeader}
        message={isErrorMessage}
        show={isError}
      />
      <Segment>
        <Form 
          size="large"
        >
          <Form.Input
            className="fluid"
            control="select"
            name="distance"
            value={distance}
            error={isDistanceError}
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
            error={isGenderError}
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
            disabled={distance ==="default" || gender ==="default"}
            className="fluid"
            type="button"
            color="red"
            size="large"
            icon="check circle"
            labelPosition="left"
            content={submitBtnContent}
            onClick={postMatchPreferences}
          >
          </Button>
        </Form>
      </Segment>
    </Grid.Column>
  );
  // }
}

MatchPreferencesForm.defaultProps = {
  colWidth: 8,
  formInstructions: "Please tell us your preferences regarding who you'd like to match with.",
  formTitle: "Your Match Characteristics",
  submitBtnContent: "Update Match Preferences",
  submitRedirect: true,
  submitRedirectURL: "/dashboard"
}

MatchPreferencesForm.propTypes = {
  colWidth: PropTypes.number,
  formInstructions: PropTypes.string,
  formTitle: PropTypes.string,
  submitBtnContent: PropTypes.string,
  submitRedirect: PropTypes.bool,
  submitRedirectURL: PropTypes.string
}

export default MatchPreferencesForm;
