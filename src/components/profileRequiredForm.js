import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import auth from "./auth";

import DropdownItems from "./dropdownItems/dropdownItems";
import genderChoices from "../models/genderChoices";

import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Popup,
  Segment
} from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

import ErrorContainer from "./errorContainer";

const ProfileRequiredForm = props => {
  const { colWidth, formInstructions, formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;
  
  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isFullNameError, setIsFullNameError] = useState(false);
  const [isGenderError, setIsGenderError] = useState(false);
  // ...Rest of the State
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

    // Form Validation
    let formError = false;

    if(fullName.length < 1) {
      setIsFullNameError(true);
      formError = true;
    } else {
      setIsFullNameError(false);
    }
    if(gender === "default") {
      setIsGenderError(true);
      formError = true;
    } else {
      setIsGenderError(false);
    }

    if(formError)
      {
        setIsErrorHeader("Unable to save your profile");
        setIsErrorMessage("Please check the fields in red and try again.");
        setIsError(true);
        return;
      }

    fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/required/update`, {
      method: "put",
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
          <Popup
            trigger={
              <Form.Input
              className="fluid"
              icon="user"
              iconPosition="left"
              name="firstName"
              value={fullName}
              placeholder="First and Last Name"
              error={isFullNameError}
              onChange={e => {
                setFullName(e.target.value)
              }}
            />
            }
            content="Seperate first and last names with a space."
            on="focus"
          />
          <Popup
            trigger={
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
            }
            content="VeloMatchr offers cyclists the option of matching with the same gender only. The gender chosen here will be used for same gender only matches."
            on="focus"
          />
          <Button
            disabled={!fullName || gender ==="default"}
            className="fluid"
            type="button"
            color="red"
            size="large"
            icon="check circle"
            labelPosition="left"
            content={submitBtnContent}
            onClick={postProfileRequired}
          >
          </Button>
        </Form>
      </Segment>
    </Grid.Column>
  );
}

ProfileRequiredForm.defaultProps = {
  colWidth: 6,
  formInstructions: "Only your first name and last initial will be displayed to other users. Your gender is never shown.",
  formTitle: "Sign In",
  submitBtnContent:"Update Profile",
  submitRedirect: true,
  submitRedirectURL: "/dashboard"
}

ProfileRequiredForm.propTypes = {
  colWidth: PropTypes.number,
  formInstructions: PropTypes.string,
  formTitle: PropTypes.string,
  submitBtnContent: PropTypes.string,
  submitRedirect: PropTypes.bool,
  submitRedirectURL: PropTypes.string
}
// colWidth, formInstructions, formTitle, submitBtnContent, submitRedirect, submitRedirectURL
export default ProfileRequiredForm;
