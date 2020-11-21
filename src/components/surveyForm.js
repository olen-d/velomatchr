import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import auth from "./auth";

import SurveyQuestion from "./surveyquestion";
import LikertItem from "./likertitem";

import questions from "../models/questions.json";
import likertItems from "../models/likertItems.json";

import MatchPreferencesForm from "./matchPreferencesForm";

import {
  Button,
  Form,
  Grid,
  Icon,
  Modal,
  Header
} from "semantic-ui-react"

import { useAuth } from "../context/authContext";

import ErrorContainer from "./errorContainer";

const error = {
  color: "#db2828"
}

const warning = {
  color: "#d9b500"
}

// Add the selectedVal attribute to the questions so we can keep track of which answer is selected in the state
questions.forEach(i => {
  i["selectedVal"] = null;
});

const SurveyForm = props => {
  const {
    colWidth,
    formInstructions,
    formTitle,
    submitBtnContent,
    submitRedirect,
    submitRedirectURL
  } = props;

  // Get items from context
  const { accessToken, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();
  const { user } = auth.getUserInfo(accessToken);

  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  // ...Rest of the State
  const [answers, setAnswers] = useState(questions);
  const [hasMatchPrefs, setHasMatchPrefs] = useState(true);
  const [hasSavedAnswers, setHasSavedAnswers] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [validate, setValidate] = useState(false);

  const setAnswerState = e => {
    const updatedAnswer = answers.map(answer => answer.id === parseInt(e.target.name) ? {...answer, ...{selectedVal: parseInt(e.target.value)}} : answer)
    setAnswers(updatedAnswer);
  }

  const ConfirmUpdateModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpen = () => {
      hasSavedAnswers ? setIsOpen(true) : postSurveyAnswers(); // Don't open the modal if a user doesn't have existing survey answers.
    }
  
    const handleClose = () => {
      setIsOpen(false);
    }
  
    const handleConfirm = async () => {
      setIsOpen(false);

      const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, user);
      if (isNewAccessToken) { setAccessToken(token); }

      fetch(`${process.env.REACT_APP_API_URL}/api/relationships/delete/requester/id/${userId}`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`
        }
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
      postSurveyAnswers();
    }
  
    return(
      <Modal
        trigger={
          <Button
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
        onClose={handleClose}
        closeIcon
      >
      <Modal.Header><span style={warning}><Icon name="exclamation triangle" />&nbsp;Update Survey Answers</span></Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            Updating your survey answers will recalculate your potential matches and delete any that are no longer deemed compatible. Pending and accepted matches will not be affected.
          </p>
          <p>
            Are you sure you want to update your survey answers?
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

  const MatchPrefsModal = props => {
    const { isOpen } = props;
  
    const updateHasMatchPrefs = () => {
      setHasMatchPrefs(true);
    }
  
    return(
      <Modal
        open={isOpen}
        size={"tiny"}
      >
      <Modal.Header><span style={error}><Icon name="exclamation triangle" />&nbsp;Match Preferences Required</span></Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <MatchPreferencesForm 
            colWidth={16}
            formTitle={""}
            formInstructions={"We need to know a couple of things about who you'd like to match with before you take the survey, otherwise we won't be able to find your matches."}
            submitBtnContent={"Save and Continue"}
            submitRedirect={true}
            submitRedirectURL={"/survey"}
            isModal={true}
            updateHasMatchPrefs={updateHasMatchPrefs}
          />
        </Modal.Description>
      </Modal.Content>
    </Modal>
    );
  }

  const postSurveyAnswers = async () => {

    const entries = answers;
    const formData = {userId: userId};

    entries.forEach(entry => {
      formData[entry.id] = entry.selectedVal;
    });

    // Form validation
    const showFormError = () => {
      setIsErrorHeader("Unable to Submit Survey");
      setIsErrorMessage("Please choose an answer for the questions in red and try again.");
      setIsError(true);
      return;
    };

    setValidate(true);
    Object.values(formData).forEach(value => {
      if (!value) {
        showFormError();
        return;
      }
    });

    const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, user);
    if (isNewAccessToken) { setAccessToken(token); }

    fetch(`${process.env.REACT_APP_API_URL}/api/survey/submit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      const { status } = data;

      if (status === 403) {
        const { message } = data;
        setIsErrorHeader("Unable to Update Survey Response");
        setIsErrorMessage(message + " Please make sure you are signed in and try again.");
        setIsError(true);
      } else if (status === 400 && data.errors) {
        setValidate(true);
        showFormError();
      } else if (status === 200) {
        // Hit the API route to calculate matches...
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
            setRedirectURL(submitRedirectURL);
            setDoRedirect(true);
          }
        }).catch(err => {
          console.log("AuthApp.js ~ 112 Error:\n", err);
          // Do something about the err
        });
      }
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  useEffect(() => { setUserId(user) }, [user])

  useEffect(() => {
    const getUserAnswers = async () => {
      const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
      if (isNewAccessToken) { setAccessToken(token); }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/survey/user/id/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data) {
        const { answers: userAnswers } = data;
        const savedAnswers = userAnswers.split(",");
        const initialAnswers = answers.map(answer => {
          return {...answer, ...{selectedVal: savedAnswers[answer.id]}};
        });
        setHasSavedAnswers(true);
        setSavedAnswers(initialAnswers);
      }
    }
    if (userId) { getUserAnswers(); }
  }, [accessToken, answers, setAccessToken, userId]);

  useEffect(() => {
    if (savedAnswers.length > 0 && !isInitialized) {
      setAnswers(savedAnswers);
      setIsInitialized(true);
    }
  }, [isInitialized, savedAnswers]);

  useEffect(() => {
    const getUserMatchPrefs = async () => {
      const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
      if (isNewAccessToken) { setAccessToken(token); }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/matches/preferences/user/id/${userId}`, 
      {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (result) {
        const { status } = result;
        status === 200 ? setHasMatchPrefs(true) : setHasMatchPrefs(false);
      }
    }

    if (userId) { getUserMatchPrefs(); } // Don't hit the API if the userId hasn't been set yet
  }, [accessToken, setAccessToken, userId]);

  return(
    <>
      <Grid.Row>
        <Grid.Column width={colWidth}>
          <Header
            as="h2"
            color="orange"
          >
            {formTitle}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={colWidth}>
          <p>
            {formInstructions}
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={colWidth}>
          <Form
            size="large"
          >
            {questions.map(question => (
              <SurveyQuestion
                key={question.id}
                id={question.id}
                number={question.number}
                text={question.text}
                answer={answers}
                validate={validate}
                onChange={setAnswerState.bind(this)}
              >
                {likertItems.map(likertItem => (
                  <LikertItem 
                    key={likertItem.id}
                    id={likertItem.id}
                    number={likertItem.number}
                    text={likertItem.text}
                  />
                  ))}  
              </SurveyQuestion>
            ))}
            <ConfirmUpdateModal />
            <MatchPrefsModal isOpen = { hasMatchPrefs ? false : true }/>
          </Form>
          <ErrorContainer
            header={isErrorHeader}
            message={isErrorMessage}
            show={isError}
          />
        </Grid.Column>
      </Grid.Row>
    </>
  );
}

SurveyForm.defaultProps = {
  colWidth: 8,
  formInstructions: "Rate the following statements on a scale of one to five, with one indicating you strongly agree, three indicating neither agreement or disagreement, and five indicating strong disagreement.",
  formTitle: "Your Cycling Preferences",
  submitBtnContent: "Find My Buddies",
  submitRedirect: true,
  submitRedirectURL: "/dashboard"
}

const { bool, number, string } = PropTypes;

SurveyForm.propTypes = {
  colWidth: number,
  formInstructions: string,
  formTitle: string,
  submitBtnContent: string,
  submitRedirect: bool,
  submitRedirectURL: string
}

export default SurveyForm
