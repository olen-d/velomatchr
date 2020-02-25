import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import auth from "./auth";

import SurveyQuestion from "./surveyquestion";
import LikertItem from "./likertitem";

import questions from "../models/questions.json";
import likertItems from "../models/likertItems.json";

import {
  Button,
  Form,
  Grid,
  Header,
} from "semantic-ui-react"

import { useAuth } from "../context/authContext";

import ErrorContainer from "./errorContainer";

// Important TODO: Check to make sure the user has match preferences and set them prior to running the survey! Maybe use a modal...
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

  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  // ...Rest of the State
  const [answers, setAnswers] = useState(questions);
  const [userId, setUserId] = useState(null);
  const [validate, setValidate] = useState(false);

  const { authTokens, setDoRedirect, setRedirectURL } = useAuth();

  const userInfo = auth.getUserInfo(authTokens);

  const setAnswerState = e => {
    const updatedAnswer = answers.map(answer => answer.id === parseInt(e.target.name) ? {...answer, ...{selectedVal: parseInt(e.target.value)}} : answer)
    setAnswers(updatedAnswer);
  }

  const postSurveyAnswers = () => {

    const entries = answers;
    const formData = {userId: userId};

    entries.forEach(entry => {
      formData[entry.id] = entry.selectedVal;
    });

    // Form validation
    let formError = false;
    setValidate(true);
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        formError = true;
        return;
      }
    });

    if(formError)
    {
      setIsErrorHeader("Unable to Submit Survey");
      setIsErrorMessage("Please choose an answer for the questions in red and try again.");
      setIsError(true);
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/survey/submit`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      // Hit the API route to calculate matches...
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
          setRedirectURL(submitRedirectURL);
          setDoRedirect(true);
        }
      }).catch(err => {
        console.log("AuthApp.js ~ 70 Error:\n", err);
        // Do something about the err
      });
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
                error={false}
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
            <Button
              className="fluid"
              type="button"
              color="red"
              size="large"
              icon="check circle"
              labelPosition="left"
              content={submitBtnContent}
              onClick={postSurveyAnswers}
            >
            </Button>
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

SurveyForm.propTypes = {
  colWidth: PropTypes.number,
  formInstructions: PropTypes.string,
  formTitle: PropTypes.string,
  submitBtnContent: PropTypes.string,
  submitRedirect: PropTypes.bool,
  submitRedirectURL: PropTypes.string
}

export default SurveyForm
