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
  Icon,
  Message,
  Modal,
  Segment
} from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

import ErrorContainer from "./errorContainer";

const warning = {
  color: "#d9b500"
}


const MatchPreferencesForm = props => {
  const { colWidth, formInstructions, formTitle, submitBtnContent, submitRedirect, submitRedirectURL, isModal, handleSubmit } = props;

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
  const [hasMatchPreferences, setHasMatchPreferences] = useState(false);

  const context = useContext(AuthContext);
  const token = context.authTokens;
  const setDoRedirect = context.setDoRedirect;
  const setRedirectURL = context.setRedirectURL;

  const userInfo = auth.getUserInfo(token);

  const ConfirmUpdateModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
      hasMatchPreferences ? setIsOpen(true) : postMatchPreferences(); // Don't open the modal if a user doesn't have existing match preferences.
    }
  
    const handleClose = () => {
      setIsOpen(false);
    }

    const handleConfirm = () => {
      setIsOpen(false);
      fetch(`${process.env.REACT_APP_API_URL}/api/relationships/delete/requester/id/${userId}`, {
        method: "delete"
      })
      .then(async response => {
        const response_1 = await response.json();
        console.log(response_1);
        // TODO: Add some sort of success message
      })
      .catch(error => {
        // TODO: Deal with the error
        console.log(error);
      });
      postMatchPreferences();
    }

    return(
      <Modal
      trigger={
        <Button
          disabled={distance ==="default" || gender ==="default"}
          className="fluid"
          type="button"
          color="red"
          size="large"
          icon="check circle"
          labelPosition="left"
          content={submitBtnContent}
          onClick={handleOpen}
        >
        </Button>
      }     
      open={isOpen}
      onClose={handleClose} closeIcon>
      <Modal.Header><span style={warning}><Icon name="exclamation triangle" />&nbsp;Update Match Preferences</span></Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            Updating your match preferences will automatically delete potential matches that do not meet the new preferences. Pending and accepted match requests will not be affected.
          </p>
          <p>
            Are you sure you want to update your match preferences?
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="grey" onClick={handleClose}>
          <Icon name="remove" /> No
        </Button>
        <Button color="orange" onClick={handleConfirm}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
    );
  }

  const postMatchPreferences = () => {
    const handleRedirect = () => {
      setRedirectURL(submitRedirectURL);
      setDoRedirect(true);
    }

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
      if (isModal) {
        handleSubmit(); // Closes the modal, if this component is wrapped in one.
      }
      // Sequelize returns true if a record is created and false is updated. 
      // The match recalculation should only run on updates.
      if (!data) {
        fetch(`${process.env.REACT_APP_API_URL}/api/matches/calculate`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userId })
        }).then(response => {
          return response.json();
        }).then(data => {
          if(data && submitRedirect) {
            handleRedirect();
          }
        }).catch(err => {
          console.log("matchPreferencesForm.js Error:\n", err);
          // Do something about the err
        })        
      } else {
        handleRedirect();
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
        setHasMatchPreferences(true);
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

          <ConfirmUpdateModal />
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
  submitRedirectURL: "/dashboard",
  isModal: false
}

MatchPreferencesForm.propTypes = {
  colWidth: PropTypes.number,
  formInstructions: PropTypes.string,
  formTitle: PropTypes.string,
  submitBtnContent: PropTypes.string,
  submitRedirect: PropTypes.bool,
  submitRedirectURL: PropTypes.string,
  isModal: PropTypes.bool,
  handleSubmit: PropTypes.func
}

export default MatchPreferencesForm;
