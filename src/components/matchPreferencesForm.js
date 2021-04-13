import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import * as auth from "./auth";

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

import { useAuth } from "../context/authContext";

import ErrorContainer from "./errorContainer";

import MatchGenderInput from "./formFields/matchGenderInput";
import MatchProximityInput from "./formFields/matchProximityInput";

import useForm from "../hooks/useForm";

const warning = {
  color: "#d9b500"
}

const MatchPreferencesForm = props => {
  const { colWidth, formInstructions, formTitle, isModal, submitBtnContent, submitRedirect, submitRedirectURL, updateHasMatchPrefs } = props;


  const [flag, setFlag] = useState(true);
  const [hasMatchPreferences, setHasMatchPreferences] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [userId, setUserId] = useState(null);

  const { errors, handleBlur, handleChange, handleServerErrors, initializeFields, values } = useForm();

  const { accessToken, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();

  const { user } = auth.getUserInfo(accessToken);

  const ConfirmUpdateModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
      hasMatchPreferences ? setIsOpen(true) : postMatchPreferences(); // Don't open the modal if a user doesn't have existing match preferences.
    }
  
    const handleClose = () => {
      setIsOpen(false);
    }

    const handleConfirm = async () => {
      const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, user);
      if (isNewAccessToken) { setAccessToken(token); }

      setIsOpen(false);
      fetch(`${process.env.REACT_APP_API_URL}/api/relationships/delete/requester/id/${userId}`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(async response => {
        const response_1 = await response.json();
        return response_1;
        // TODO: Add some sort of success message
      })
      .catch(error => {
        // TODO: Deal with the error
        console.log(error);
      });
      handleSubmit();
    }

    return(
      <Modal
        trigger={
          <Button
            disabled={Object.entries(values).length < 2 || isError}
            className="fluid"
            type="button"
            color="red"
            size="large"
            icon="check circle"
            labelPosition="left"
            content={submitBtnContent}
            onMouseUp={handleOpen}
          >
          </Button>
        }     
        open={isOpen}
        onClose={handleClose} closeIcon
      >
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

  const handleSubmit = () => {
    if (!isError) {
      postMatchPreferences();
    } else {
      // TODO: return failure
    }
  }

  const postMatchPreferences = async () => {
    const { matchProximityPref: distance, matchGenderPref: gender } = values;

    const formData = { 
      userId,
      distance,
      gender
    };

    const handleRedirect = () => {
      setRedirectURL(submitRedirectURL);
      setDoRedirect(true);
    }

    const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, user);
    if (isNewAccessToken) { setAccessToken(token); }

    fetch(`${process.env.REACT_APP_API_URL}/api/matches/preferences/submit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data.errors) {
        const { errors } = data;

        errors.forEach(e => {
          handleServerErrors(e);
        })
      } else {
        if (isModal) {
          // handleSubmit(); // Closes the modal, if this component is wrapped in one.
          // TODO: Close the modal this component is wrapped in
          updateHasMatchPrefs();
        }

        // Sequelize returns true if a record is created and false is updated. 
        // The match recalculation should only run on updates.
        if (!data) {
          fetch(`${process.env.REACT_APP_API_URL}/api/matches/calculate`, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
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
      }
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  useEffect(() => { setUserId(user) }, [user]);

  useEffect(() => {
    const getUserMatchPrefs = async () => {
      const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
      if (isNewAccessToken) { setAccessToken(token); }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/matches/preferences/${userId}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data && data.user && data.user.userMatchPrefs) { // Skips the destructuring if any of these are null, which would throw a type error
        const { user: { userMatchPrefs: { distance: matchProximityPref, gender: matchGenderPref },},} = data;
        setInitialValues({ matchProximityPref, matchGenderPref});
        setHasMatchPreferences(true);
      }
    }
    if (userId) { getUserMatchPrefs(); }
  }, [accessToken, setAccessToken, userId]);

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError) {
      setIsErrorHeader("Unable to Update Match Preferences");
      setIsErrorMessage("Please select an option from the fields shown in red.");
    }
  }, [isError]);

  if(Object.keys(initialValues).length > 0 && flag) {
    initializeFields(initialValues);
    setFlag(false);
  }

  return(
    <Grid.Column width={colWidth}>
      <Header 
        as="h2" 
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
          <MatchProximityInput 
            errors={errors}
            initialValue={values.gender} 
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <MatchGenderInput 
            errors={errors}
            initialValue={values.gender} 
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <ConfirmUpdateModal />
        </Form>
      </Segment>
    </Grid.Column>
  );
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
  updateHasMatchPrefs: PropTypes.func
}

export default MatchPreferencesForm;
